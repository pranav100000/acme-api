export default function PageHeader({ title, actions, children }) {
	return (
		<div className="page-header">
			<div>
				<h2>{title}</h2>
				{children}
			</div>
			{actions}
		</div>
	);
}
