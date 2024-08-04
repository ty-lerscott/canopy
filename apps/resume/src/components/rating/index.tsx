import { createId } from "@paralleldrive/cuid2";
import cn from "../../utils/class-name.ts";

import styles from "./styles.module.css";

const Star = ({
	invert,
	percent = 0,
}: {
	percent: number;
	invert?: boolean;
}) => {
	const offset = `${percent}%`;

	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			className={styles.Star}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Star</title>
			<defs>
				<linearGradient
					id={`fill-${percent}`}
					x1="0%"
					y1="0%"
					x2="100%"
					y2="0%"
				>
					<stop
						offset={offset}
						style={{
							stopOpacity: 1,
							stopColor: `var(${invert ? "--shadow" : "--secondary"})`,
						}}
					/>
					<stop
						offset={offset}
						style={{
							stopOpacity: 1,
							stopColor: `var(${invert ? "--secondary" : "--shadow"})`,
						}}
					/>
				</linearGradient>
			</defs>
			<path
				fill={`url(#fill-${percent})`}
				d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
			/>
		</svg>
	);
};

const Rating = ({
	rating,
	invert,
	className,
}: {
	rating: number;
	invert?: boolean;
	className?: string;
}) => {
	const safeRating = Math.min(Math.max(rating, 0), 5);

	return (
		<div data-testid="Index" className={cn(styles.Rating, className)}>
			{Array.from({ length: 5 }).map((_, ind) => {
				const starNumber = ind + 1;
				const percent =
					Math.min(Math.max(safeRating - (starNumber - 1), 0), 1) * 100;

				return (
					<Star key={`Star-${createId()}`} percent={percent} invert={invert} />
				);
			})}
		</div>
	);
};

export default Rating;
