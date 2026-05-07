# Wishaw YMCA Digital Badging Brief

## About Wishaw YMCA Esports Academy

The Wishaw YMCA Esports Academy works with young people aged 8–18 and focuses on providing opportunities for socialisation, recreation, healthy competition, and skill development while supporting positive destinations for young people by working closely with educational institutions and community anchor organisations.

The Academy was established in 2023 and has grown from 8 young people attending weekly to over 80 weekly attendees engaging with a variety of programs every day of the week. There is no fee for attendance as the work is funded by small grants from the National Lottery and Local Authority and is delivered at Wishaw by a staff team of 2 staff and 3 volunteers.

Our work has been recognised on the world stage through the YMCA movement and is gaining interest from local YMCAs across the UK and Europe. Several of our programs have been or are currently being piloted across 5 other YMCAs, 4 in Scotland and 1 in Ireland. We have interest from 12 further centres in Scotland and 10 in Ireland and are working on the development of a cross-country league that should take place towards the end of 2026 funded by YMCA Europe.

## Academy Structure

We currently operate the following groups:

### Juniors (Age 8–14)
All of the junior groups are currently using the digital badge system. Groups are game specific and young people attend weekly sessions where they work through different modules related to their game.

- **Minecraft** — Survival challenges, build battles, PvP, speedrunning.
- **Rocket League** — Rank based challenges, mechanics masterclass, team building.
- **Fortnite** — Rank based challenges, mechanics masterclass, team building.

### Competitive Groups (13+/16+)
- **Fortnite Competitive Group** — Coaching and skill development for competitive teams for Fortnite.
- **Rocket League Competitive Group** — Coaching and skill development for competitive teams for Rocket League.
- **YEsports Tournament Group** — Focus on inter-YMCA competitions.

### Media Group
- **Broadcast & Podcast group** — Live production, digital design, commentary.

### Casual Gaming
- **Esports drop in** — Casual esports and gaming group, free play & social.
- **Reset & Respawn** — Mental Health Awareness Gaming Group.

## The Problem

We initially had the badging system being used by a small group. We had built a WordPress site with very limited knowledge or expertise and profiles were updated manually.

Here is the site and log in:

- **URL:** <https://wymcaesports.co.uk/wp-login>
- **Username:** User1
- **Password:** wYMCA15#

> **Disclaimer:** Nothing on the site is a style choice. We are not keen on how it looks, but this was what we could do.

When this was created we did not have modules and were only adding subbadges and points to profiles. It was very time consuming having to add session points to each player as well as upload the subbadge image.

When the program grew, adding more young people at Wishaw and from the pilot sites, we changed the structure to include modules to make the program easier to package and score and for other sites.

This is where the capability of the WordPress site stopped.

We were unable to figure out how to update the site to include modules so we started tracking progress on Google Sheets. This also meant the player profiles were out of date so we awarded certificates showing sub-badges instead.

Here is a sample from the various sheets:

- **digital-badge-tracker-sample** — <https://docs.google.com/spreadsheets/d/1Vw7fIviuyZapA7cyG4KVUluPDLlMTXk33Pnnvb_tkXY/edit?usp=sharing>

You will see examples of 2 modules (**Road to Diamond** for Rocket League and **Defeat the Ender Dragon** for Minecraft) with breakdowns of the subbadges, schedules and point tracking.

## Challenge

We are seeking help to have a web app created for easy tracking of badges, modules and subbadges for multiple groups across multiple sites. With admin access to allow adding of badges/subbadges and new modules.

## Explanation of how the badging system works

The Wishaw YMCA Esports Academy’s badging system is used to provide members with a gamified learning experience. It is used with our junior groups and in pilot with other YMCA sites.

It is based on 5 badges regardless of age group, game, module or activity. The ultimate goal is to level up these badges:

- **Game Mastery** — Game Mastery involves young gamers learning game mechanics, developing strategies, and making informed decisions during gameplay.
- **Teamwork** — Teamwork is when young people work together by sharing goals, supporting each other, and completing tasks to achieve a common outcome, both in games and in real life.
- **Esports Citizen** — Esports citizen is where young people learn how to participate online in a positive way, supporting positive competition, being able to communicate appropriately and creating a code of conduct in their groups and teams.
- **Personal Development** — Personal development is used to improve young people's skills, building confidence and self-awareness. It involves young people identifying, reviewing, and reflecting on their mistakes, setting new goals, and focusing on improving their performance.
- **Digital Skills** — Digital skills involve young people learning how to stay safe online and understanding how to use online tools. It also includes developing confidence in using technology, communicating responsibly, and using digital platforms to learn and create.

Young people attend weekly sessions in groups based on their chosen game and are guided through different modules based on that game.

Modules are like courses. They can last between 12–16 weeks with a lesson or challenge being presented each week at an in-person session guided by a trained youth worker. Each session has a delivery plan and associated resources. Each module has an overall learning outcome or goal related to the game and a collection of associated sub-badges.

Each sub-badge is associated with one of the 5 main badges and has a points value. This is how the 5 main badges level up. Sub-badges should also have at least 2 associated skills from the Youthwork Skills and Outcomes Framework. There are usually around 15 subbadges in a module.

Each sub-badge awards points towards one of the 5 main badges, levelling it up. Points carry on across modules.

### Current scale for levels
- **0–30 points:** Bronze
- **31–70 points:** Silver
- **71–120 points:** Gold
- **120+ points:** Platinum

We would like to be able to add new levels like **Emerald, Diamond, Master, Pro**.

> We could change the sub-badges to be challenges and points to XP that level up the badges. This would probably simplify the process and require fewer images.

## Solution

A modern, easily accessible, and secure web app with the following capabilities:

- Descriptions of main badges
- Editable modules, with sub-badges/challenges (with associated YSOF skills)
- User profiles displaying name, image, overall badge progress, module progress (sub-badges or challenges) and completed modules
- Users split into groups based on their game groups and centre
- Admin dashboard with ability to add and remove groups, users and modules, award sub badges/complete challenges
- Leaderboards comparing all users across badge scores and completed modules
- Leaderboard views by centre and potentially global leaderboards
- No data collection; users log in with username and password, and no personal details are added
- Capability for the organisation to add all of the data, images and descriptions themselves

## Perfect Solution

- Modules acting like online courses with the ability to upload session plans, delivery notes and lesson resources like PowerPoint slides or videos
- Ability for users to upload evidence of completed sub badge/challenge for approval by admin
- Main admin user as app manager, with ability to add new admins for each centre and approve the use of new modules
- Admin users for each centre with the ability to add users to approved modules and update user progress
- Centre leaderboard showing progress of each centre

## Mindblowing Solution

- Ability to add mini tournaments for competition between centres
