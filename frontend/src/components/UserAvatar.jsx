import { getInitials } from "../utils/formatters";

export default function UserAvatar({ name, size = "md" }) {
	return (
		<div className={`user-avatar user-avatar-${size}`}>
			{getInitials(name) || "?"}
		</div>
	);
}
