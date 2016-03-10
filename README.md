notif Unified Interface
=======================

**notif** is going to solve your notification (mobile, browser) infrastructure problems.
There are some really bad and super confusing APIs out there.
We'll deal with that.

This *Unified Interface* is the first step in that direction.
The Unified Interface is a neat little web service that has a better interface for sending notifications than GCM or APN.
Oh, and it lets you send notifications that work on whatever device type you want with the same code.

There are two types of notifications:

- *Visible Notifications* are shown immediately on the device upon delivery.
- *Data Notifications* contain data, and do not display anything.
  They let the app act based on the data.

## Visible Notification

Here's an example of sending a Visible Notification:

    POST /visible-notification
    App-Token: /*your app token*/
    -----
    {
      "to": /*to:string|array*/,
      "type": /*type:string*/,
      "collapse": /*collapse:boolean*/,
      ["title": /*title:string*/,]
      "body": /*body:string*/
    }

    <-- 200 OK
        {
          "deletedRecipients": /*deletedRecipients:array*/,
          "updatedRecipients": /*updatedRecipients:array*/
        }

### Possible additions:

- localizable strings
- click actions
- badge count (similar behaviour for android?)

### #wontfix

- sound
- color
- icon

The fields break down as such:

| field    | description                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| to       | This field may contain either a notification key, a topic, a registration token, or an array of registration tokens.         |
| type     | This field contains a notification type. This is a semi-unique string that you choose for this type of notification.         |
| collapse | This field must be a boolean. If `true`, only one notification (the latest) of this type will be shown at a time.            |
| title    | The optional string title shown in the notification. Only works on Android and Apple Watch. Defaults to the name of the app. |
| body     | The main body of text (a string) that will be displayed.                                                                     |

The Unified Interface is based on GCM, so the recipients must exist in GCM.

The response fields describe recipients that could not receive the notification, either because they are no longer registered, or because the registration id has changed.

The `deletedRecipients` array is a list of strings, each string being a registration id that has been deleted and should not be sent to in the future.

The `updatedRecipients` array is a list of entries with a `from` and `to` field. Each entry represents a renamed registration id, `from` being the original and `to` being the id that should be used in the future for this user.

## Data Notification

Here's an example of sending a Data Notification:

    POST /data-notification
    App-Token: /*your app token*/
    -----
    {
      "to": /*to:string|array*/,
      "type": /*type:string*/,
      "collapse": /*collapse:boolean*/,
      "data": /*data:object*/
    }

    <-- 200 OK
        {
          "deletedRecipients": /*deletedRecipients:array*/,
          "updatedRecipients": /*updatedRecipients:array*/
        }

The fields break down as such:

| field    | description                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| to       | This field may contain either a notification key, a topic, a registration token, or an array of registration tokens. |
| type     | This field contains a notification type. This is a semi-unique string that you choose for this type of notification. |
| collapse | This field must be a boolean. If `true`, only one notification (the latest) of this type will be shown at a time.    |
| data     | This is the data made available to the app. It must be a JSON object and will be made available as a JSON object.    |

The response is the same as for Visible Notifications.

## What's that App-Token?

Now that we've covered sending a notification, you are probably wondering what that `App-Token` is.
I mean, it's required for sending a notificaiton off to an app, right?

When you create your app, and set it up with GCM you get an API Key.
This key can be used to create an App-Token through the Unified Interface:

    POST /app
    -----
    {
      "apiKey": /*apiKey:string*/,
      "appType": /*appType:"ios"|"android"*/
    }

    <-- 200 OK
        { "appToken": /*appToken:string*/ }

Guess what the fields are...

| field   | description                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| apiKey  | The API Key gotten from GCM                                                                                                    |
| appType | The type of app. Should be `"ios"` if the `apiKey` corresponds to an iOS app, `"android"` if it corresponds to an Android app. |

If you want to clean up an app token, it is done simply with:

    DELETE /app/{appToken}

    <-- 200 OK

## Future

In the future we will need to add some kind of account token which is linked to an account that will be charged based on the usage.
This is for monetization reasons.
