import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import * as api from "../api";

const typeIcons = {
	system: "🔔",
	user: "👤",
	team: "🏷️",
};

function formatRelativeTime(value) {
	const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
	const deltaSeconds = Math.round((new Date(value) - Date.now()) / 1000);
	const divisions = [
		{ amount: 60, unit: "second" },
		{ amount: 60, unit: "minute" },
		{ amount: 24, unit: "hour" },
		{ amount: 7, unit: "day" },
		{ amount: 4.34524, unit: "week" },
		{ amount: 12, unit: "month" },
		{ amount: Number.POSITIVE_INFINITY, unit: "year" },
	];
	let duration = deltaSeconds;
	for (const division of divisions) {
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.unit);
		}
		duration /= division.amount;
	}
	return new Date(value).toLocaleDateString();
}

export default function NotificationCenter() {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const unreadCount = useMemo(
		() => notifications.filter((notification) => !notification.read).length,
		[notifications],
	);

	useEffect(() => {
		let ignore = false;
		async function loadNotifications() {
			if (!user?.id) return;
			setLoading(true);
			setError("");
			try {
				const data = await api.getNotifications(user.id);
				if (!ignore) setNotifications(data);
			} catch (err) {
				if (!ignore) setError(err.message);
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		loadNotifications();
		const interval = setInterval(loadNotifications, 30000);
		return () => {
			ignore = true;
			clearInterval(interval);
		};
	}, [user?.id]);

	const handleMarkRead = async (notification) => {
		if (notification.read) return;
		try {
			const updated = await api.markNotificationRead(user.id, notification.id);
			setNotifications((current) =>
				current.map((item) => (item.id === updated.id ? updated : item)),
			);
		} catch (err) {
			setError(err.message);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			const { notifications: updatedNotifications } =
				await api.markAllNotificationsRead(user.id);
			setNotifications(updatedNotifications);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="notification-center">
			<button
				type="button"
				className="notification-trigger"
				onClick={() => setOpen((current) => !current)}
				aria-expanded={open}
				aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
			>
				<span aria-hidden="true">🔔</span>
				{unreadCount > 0 && (
					<span className="notification-badge">{unreadCount}</span>
				)}
			</button>
			{open && (
				<div className="notification-panel">
					<div className="notification-panel-header">
						<div>
							<h3>Notifications</h3>
							<p>{unreadCount} unread updates</p>
						</div>
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={handleMarkAllRead}
							disabled={unreadCount === 0}
						>
							Mark all read
						</button>
					</div>
					{error && <div className="notification-error">{error}</div>}
					<div className="notification-list">
						{loading && notifications.length === 0 ? (
							<div className="notification-empty">Loading notifications…</div>
						) : notifications.length === 0 ? (
							<div className="notification-empty">You're all caught up.</div>
						) : (
							notifications.slice(0, 6).map((notification) => {
								const content = (
									<>
										<div className="notification-icon" aria-hidden="true">
											{typeIcons[notification.type] || "🔔"}
										</div>
										<div className="notification-content">
											<div className="notification-title-row">
												<strong>{notification.title}</strong>
												<span
													className={`priority-dot priority-${notification.priority}`}
												/>
											</div>
											<p>{notification.message}</p>
											<span className="notification-time">
												{formatRelativeTime(notification.createdAt)}
											</span>
										</div>
									</>
								);
								return notification.actionUrl ? (
									<Link
										to={notification.actionUrl}
										key={notification.id}
										className={`notification-item${notification.read ? " is-read" : ""}`}
										onClick={() => {
											handleMarkRead(notification);
											setOpen(false);
										}}
									>
										{content}
									</Link>
								) : (
									<button
										type="button"
										key={notification.id}
										className={`notification-item${notification.read ? " is-read" : ""}`}
										onClick={() => handleMarkRead(notification)}
									>
										{content}
									</button>
								);
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
}
