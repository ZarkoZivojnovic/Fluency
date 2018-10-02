# Fluency
    
### Online [DEMO](http://fluency.epizy.com) version
   
---
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
---
Blocked users will not be displayed on the online users list and you will not receive messages from them.
But if you change your mind, you can unblock them.
   
---
##### Registration 
You need to enter unique email and username for registration. Verification email will be sent after successfull registration and
until email is unverified you will not be able to access the content of the application.
---
![Screenshot](./graph/screenshot/register.jpg?raw=true "Registration")
---
##### Forgot password
If you forget the password you can require an email to reset it.

---
##### Login / Logout
For login you must enter email and password. After successfull logging you will be redirected to dashboard and your status will be changed to "online".
By clicking on *"Sign Out"* button status will be setted to "offline", same as you leave the page.
Third status option is "away" and it will appear if there is no activity on the page.
---
##### Channels:
All online users will be dispayed on this page. If you want to filter users by language you must select one of the options in select list.
There is also an option to search users by username and on this page you can to send message or video chat call to someone.
---
![Screenshot](./graph/screenshot/channels.jpg?raw=true "Channels")
---
##### Users profile information (personal info, about me, language info)
Every user can fill in this forms with their data.
 
  * set/change profile photo
  * native language / other languages and level
  * country, birthday, interests, etc...
---    
![Screenshot](./graph/screenshot/profile.jpg?raw=true "Profile")
---
![Screenshot](./graph/screenshot/edit.jpg?raw=true "Edit profile")
---
##### Messages:
  
   * list of conversations sorted by received date
   * new message notification
   * show only last 20 messages in conversation / show whole conversation
   * sent / seen message status
   * delete conversation
---
![Screenshot](./graph/screenshot/msg_notification.jpg?raw=true "Message notification")
---    
![Screenshot](./graph/screenshot/conversation.jpg?raw=true "Conversation")
---
##### Other options: 

 * add / remove to favorite
   * all favorites / online favorites
   * add / remove to block list
   * user rating
   * edit profile
   * change password
   * delete profile
---