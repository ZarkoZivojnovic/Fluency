# Fluency
    
### Online [DEMO](http://fluency.epizy.com) version
   
---

This is a real time chat and video chat application for improving foreign languages. It differs from
other applications because you can be both a teacher and the student. You can help someone to master the language you know well,
and someone else will help you. The application is easy to use. Find your perfect conversation partner and enjoy in chat, while at the
same time practicing your language skills. The text chat will helps you to improve your written technique 
and you can practice your spoken skills trough video chat. After the conversation, do not forget to rate
the user. That will help other users to choose the right interlocutor.  

For the back-end we used Firebase authentication for login, Firebase database to store all the data and Firebase storage to store profile photos.
We have three pages here. The first two are for login and registration, and the third is for the dashboard where all other parts of the application are displayed.
The dashboard has 6 main parts:
- My messages *- There is a list of all conversations* 
- My profile *- To see how your profile looks like*
- My favorites *- List of your favorite users*
- My block list *- List of blocked users*
- Channels *- List of online users and search form by language and level*
- Settings *- Here you can find edit profile, change password and delete profile forms*
---
Blocked users will not be displayed on the online users list and you will not receive messages from them.
But if you change your mind, you can unblock them.
***   

#### Registration:

You need to enter unique email and username for registration. Verification email will be sent after successful registration and
until email is unverified you will not be able to access the content of the application.

---
![Screenshot](./graph/screenshot/register.jpg?raw=true "Registration")
---

#### Forgot password:

If you forget the password you can require an email to reset it.

---

#### Login / Logout:

For login you must enter email and password. After successful logging you will be redirected to dashboard and your status will be changed to "online".
By clicking on *"Sign Out"* button status will be setted to "offline", same as you leave the page.
Third status option is "away" and it will appear if there is no activity on the page.

---

#### Channels:

All online users will be displayed on this page. If you want to filter users by language you must select one of the options in select list.
There is also an option to search users by username and on this page you can to send message or video chat call to someone.
---
![Screenshot](./graph/screenshot/channels.jpg?raw=true "Channels")
---

#### Users profile information (personal info, about me, language info):

Every user can fill in this forms with their data. It is not mandatory but it would be good to add data about languages.
  * If you want to add photo in your profile you can do it by clicking on _**"profile photo"**_ in the sidebar. 
  * In _**personal info**_ section you can add your name, city, country, birthday and gender.
  * _**About me**_ section is about your interests and there is some text area to write what you want about yourself.
  * and the last and most important section - _**languages**_ where you can add your native language and other languages you speak. For the every language you can choose the level. Offered options are: *elementary*, *intermediate* and *advanced*.
 
---    
![Screenshot](./graph/screenshot/profile.jpg?raw=true "Profile")
---
![Screenshot](./graph/screenshot/edit.jpg?raw=true "Edit profile")
---

#### Messages:
All your conversations are in this section. They are sorted by received date. If you add a new
conversation it will be placed on top of the list. 
When new message is received you will get a 
notification in the sidebar and also next to the name of conversation. 
By clicking on the conversation name (displayed as same as username of your conversation partner)
you will see conversation content. Only 20 last messages will be displayed. At the top of conversation
will be placed _**"whole conversation"**_ button and clicking on it will be printed whole conversation.
Below the message in chat, the message status is printed _(**sent** and **seen**)_ and that be automatically
updated when the message is seen.
Do not forget to rate your interlocutor. You can rate the same user how many time you want but current evaluation
will cancel the previous one.
Also, you can to delete the conversation. If you start a new conversation with this user, deleted messages 
will not be available.  

---
![Screenshot](./graph/screenshot/msg_notification.jpg?raw=true "Message notification")
---    
![Screenshot](./graph/screenshot/conversation.jpg?raw=true "Conversation")
---

#### Other options: 
When you open someone's profile, you will see _**"Add To Favorites"**_ and _**"Block"**_ buttons.
If that user is already on your favorites list you can remove him from the list. The same applies to the 
block list.
Whenever you want, you can edit your profile. Also, you can change your password at any time.
And if you do not want to use our application any more, you can delete profile. 
By deleting the profile, all data will be permanently lost.
---

#### If you have some trouble with our application, feel free to contact us by [email](mailto:appfluency@gmail.com)

---