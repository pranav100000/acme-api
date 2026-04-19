import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import * as api from "../api";

function formatRelativeTime(value) {
	const timestamp = new Date(value).getTime();
	const diffMs = Date.now() - timestamp;
	const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
	if (diffMinutes < 60) return `${diffMinutes}m ago`;
	const diffHours = Math.round(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.round(diffHours / 24);
	return `${diffDays}d ago`;
}

export default function NotificationBell() {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const dropdownRef = useRef(null);

	const loadNotifications = useCallback(async () => {
		if (!user?.id) return;
		try {
			const [items, count] = await Promise.all([
				api.getNotifications(user.id),
				api.getUnreadNotificationCount(user.id),
			]);
			setNotifications(items);
			setUnreadCount(count.count);
			setError("");
		} catch (err) {
			setError(err.message || "Failed to load notifications");
		}
	}, [user?.id]);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	useEffect(() => {
		function handlePointerDown(event) {
			if (!dropdownRef.current?.contains(event.target)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	const handleMarkRead = async (notification) => {
		if (notification.read) return;
		await api.markNotificationRead(notification.id, user.id);
		setNotifications((current) =>
			current.map((item) =>
				item.id === notification.id ? { ...item, read: true } : item,
			),
		);
		setUnreadCount((count) => Math.max(0, count - 1));
	};

	const handleMarkAllRead = async () => {
		await api.markAllNotificationsRead(user.id);
		setNotifications((current) =>
			current.map((notification) => ({ ...notification, read: true })),
		);
		setUnreadCount(0);
	};

	return (
		<div className="notification-menu" ref={dropdownRef}>
			<button
				type="button"
				className="notification-bell"
				onClick={() => setOpen((isOpen) => !isOpen)}
				aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
				aria-expanded={open}
			>
				<span aria-hidden="true">🔔</span>
				{unreadCount > 0 && (
					<span className="notification-count">{unreadCount}</span>
				)}
			</button>

			{open && (
				<div className="notification-dropdown">
					<div className="notification-dropdown-header">
						<div>
							<h3>Notifications</h3>
							<p>{unreadCount} unread</p>
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

					{error ? (
						<div className="notification-empty">{error}</div>
					) : notifications.length === 0 ? (
						<div className="notification-empty">No notifications yet</div>
					) : (
						<div className="notification-list">
							{notifications.slice(0, 5).map((notification) => (
								<Link
									key={notification.id}
									to={notification.actionUrl || "/notifications"}
									className={`notification-item ${notification.read ? "is-read" : "is-unread"}`}
									onClick={() => {
										handleMarkRead(notification);
										setOpen(false);
									}}
								>
									<span
										className={`notification-dot notification-${notification.type}`}
									/>
									<div className="notification-item-body">
										<strong>{notification.title}</strong>
										<p>{notification.message}</p>
										<time>{formatRelativeTime(notification.createdAt)}</time>
									</div>
								</Link>
							))}
						</div>
					)}

					<Link
						to="/notifications"
						className="notification-view-all"
						onClick={() => setOpen(false)}
					>
						View notification center
					</Link>
				</div>
			)}
		</div>
	);
}
