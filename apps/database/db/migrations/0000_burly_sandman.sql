CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`School` text,
	`Degree` text,
	`Major` text,
	`Start Date` text,
	`End Date` text,
	`User Id` text,
	FOREIGN KEY (`User Id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`Role` text,
	`Company` text,
	`End Date` text,
	`Location` text,
	`Work Style` text,
	`Start Date` text,
	`Resume Id` text,
	`Body` text,
	FOREIGN KEY (`Resume Id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`Name` text,
	`User Id` text,
	FOREIGN KEY (`User Id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`Name` text,
	`End Date` text,
	`Is Active` integer,
	`Start Date` text,
	`Favorite` integer,
	`Comfort Level` integer,
	`Resume Id` text,
	FOREIGN KEY (`Resume Id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `socials` (
	`id` text PRIMARY KEY NOT NULL,
	`Name` text,
	`Href` text,
	`User Id` text,
	FOREIGN KEY (`User Id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`Address` text,
	`Last Name` text,
	`First Name` text,
	`Profession` text,
	`Display Name` text,
	`Email Address` text,
	`Phone Number` integer
);
