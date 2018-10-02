#Fluency

####Online [DEMO](http://fluency.epizy.com) version

This is a real time chat and video chat application for improving foreign languages.
For the backend we used Firebase authentication for login, Firebase database to store all the data and Firebase storage to store profile photos.
We have three pages here. The first two are for login and registration, and the third is for the dashboard where all other parts of the application are dispayed.
The dashboard has 6 main parts:
- My messages *- There is a list of all conversations* 
- My profile *- To see how your profile looks like*
- My favorites *- List of your favorite users*
- My block list *- List of blocked users*
- Channels *- List of online users and search form by language and level*
- Settings *- Here you can find edit profile, change password and delete profile forms*

Blocked users will not be displayed on the online user list and you will not receive messages from them.

---

- registration (email, username, password)

![Screenshot](./graph/screenshot/register.jpg?raw=true "Registration")

- forgot password
- send email verification
- login / logout
- status (online, offline, away)
- channels: 
    * filter online users by language
    * search users by username 
    * start chat / voice chat
    
![Screenshot](./graph/screenshot/channels.jpg?raw=true "Channels")

- users profile information (personal info, about me, language info) 
    * set/change profile photo
    * native language / other languages and level
    * country, birthday, interests, etc...
    
![Screenshot](./graph/screenshot/profile.jpg?raw=true "Profile")

![Screenshot](./graph/screenshot/edit.jpg?raw=true "Edit profile")

- messages:
    * list of conversations sorted by received date
    * new message notification
    * show only last 20 messages in conversation / show whole conversation
    * sent / seen message status
    * delete conversation

![Screenshot](./graph/screenshot/msg_notification.jpg?raw=true "Message notification")
    
![Screenshot](./graph/screenshot/conversation.jpg?raw=true "Conversation")
    
- other options: 
    * add/remove to favorite
    * all favorites / online favorites
    * add/remove to block list
    * user rating
    * edit profile
    * change password
    * delete profile