import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import * as api from "../api";

const TYPE_LABELS = {
	info: "Info",
	success: "Success",
	warning: "Warning",
	error: "Error",
};

export default function NotificationsPage() {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [filter, setFilter] = useState("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadNotifications = useCallback(async () => {
		try {
			setLoading(true);
			const items = await api.getNotifications(user.id, {
				unreadOnly: filter === "unread",
			});
			setNotifications(items);
			setError("");
		} catch (err) {
			setError(err.message || "Failed to load notifications");
		} finally {
			setLoading(false);
		}
	}, [filter, user.id]);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	const handleMarkRead = async (notification) => {
		await api.markNotificationRead(notification.id, user.id);
		setNotifications((current) =>
			current.map((item) =>
				item.id === notification.id ? { ...item, read: true } : item,
			),
		);
	};

	const handleMarkAllRead = async () => {
		await api.markAllNotificationsRead(user.id);
		setNotifications((current) =>
			current.map((notification) => ({ ...notification, read: true })),
		);
	};

	return (
		<>
			<div className="page-header">
				<div>
					<h2>Notification Center</h2>
					<p className="page-subtitle">
						Unified user, team, and system notifications for {user.name}
					</p>
				</div>
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleMarkAllRead}
					disabled={!notifications.some((notification) => !notification.read)}
				>
					Mark all read
				</button>
			</div>
			<div className="page-body">
				{error && <div className="alert alert-error">{error}</div>}

				<div className="notification-toolbar">
					{["all", "unread"].map((value) => (
						<button
							type="button"
							key={value}
							className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-secondary"}`}
							onClick={() => setFilter(value)}
						>
							{value === "all" ? "All" : "Unread"}
						</button>
					))}
				</div>

				<div className="card notification-center-card">
					{loading ? (
						<div className="loading">
							<div className="spinner"></div>
						</div>
					) : notifications.length === 0 ? (
						<div className="empty-state">
							<div className="empty-icon">🔔</div>
							<p>
								No {filter === "unread" ? "unread" : ""} notifications found
							</p>
						</div>
					) : (
						<div className="notification-center-list">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`notification-center-item ${notification.read ? "is-read" : "is-unread"}`}
								>
									<div
										className={`notification-type notification-${notification.type}`}
									>
										{TYPE_LABELS[notification.type] || "Info"}
									</div>
									<div className="notification-center-content">
										<div className="notification-center-title-row">
											<h3>{notification.title}</h3>
											<time>
												{new Date(notification.createdAt).toLocaleString()}
											</time>
										</div>
										<p>{notification.message}</p>
										<div className="notification-center-actions">
											{notification.actionUrl && (
												<Link
													to={notification.actionUrl}
													className="btn btn-secondary btn-sm"
												>
													Open related page
												</Link>
											)}
											{!notification.read && (
												<button
													type="button"
													className="btn btn-primary btn-sm"
													onClick={() => handleMarkRead(notification)}
												>
													Mark read
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
