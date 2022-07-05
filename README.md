# tobeyou_facilitator

The [facilitator dashboard](https://facilitator.tobeyou.sg) is a website for facilitators
to collect and display players' responses from the [ToBeYou game](https://game.tobeyou.sg).
Facilitators can create classes for their participants to join, assign them class work,
and view their progress and in-game responses,
as a way of starting conversations about the issues raised in the main game.

![Screenshot of main page of facilitator dashboard](/public/screenshots/dashboard.png)

## User Guide

To log into the facilitator dashboard, you may create a new account
or use the same account as the ToBeYou game.

On the facilitator dashboard, you may create a class and
invite participants to join in by sharing with them a link to the main game.
Once participants have joined your class on the main game,
you will be able to see their game information,
including their game progress, game choices, reflection responses, and quiz answers.

![Screenshot of room page of facilitator dashboard](/public/screenshots/room-page.png)

For more details on using the facilitator dashboard,
please visit our [facilitation guide](https://docs.google.com/presentation/d/1XsiCXh4mgDa4O470tRjYaThRSJ4lAQ7HjrPzrMhvRZc/edit#slide=id.g13295cf6703_0_208).

## Developer Guide

### Setup

Ensure that node is on version `14`.
Run `npm install` to install the required dependencies,
then run `npm start` to start the app on `localhost:3000`.

### Environment Variables

This project requires you to set up a Firebase project.
Once Firebase has been set up, set the following environment variables to
their appropriate values from Firebase in an `.env` file:

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`

## Community

This is a nonprofit volunteer-run project by [better.sg](https://better.sg).

<a href="https://better.sg/join.html">
  <img width="192.35" height="50" src="https://better.sg/wp-content/uploads/2020/12/betterwordlogo@0.5x.png" />
</a>
