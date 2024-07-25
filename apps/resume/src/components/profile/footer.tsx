import { Button } from "@/components/button";
import type { FC, ReactElement } from "react";

type FormState = {
	canSubmit: boolean;
	isSubmitting: boolean;
};

type SubscribeProps = {
	selector: (state: FormState) => FormState;
	children: (state: FormState) => ReactElement;
};

const FormFooter = ({
	reset,
	Subscribe,
}: {
	reset: () => void;
	Subscribe: FC<SubscribeProps>;
}) => {
	return (
		<Subscribe
			selector={({
				canSubmit,
				isSubmitting,
			}: { canSubmit: boolean; isSubmitting: boolean }) => ({
				canSubmit,
				isSubmitting,
			})}
		>
			{({
				canSubmit,
				isSubmitting,
			}: { canSubmit: boolean; isSubmitting: boolean }) => (
				<div className="grid grid-cols-2 gap-4 mt-4">
					<Button
						variant="outline"
						type="button"
						onClick={reset}
						className="shrink-0 w-full"
					>
						Reset
					</Button>

					<Button
						type="submit"
						disabled={!canSubmit}
						className="shrink-0 w-full"
					>
						{isSubmitting ? "Updating..." : "Update"}
					</Button>
				</div>
			)}
		</Subscribe>
	);
};

export default FormFooter;
