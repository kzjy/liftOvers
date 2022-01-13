# LifTOvers

## Description 
We are creating a management dashboard to allow LifTOvers admin to manage the "lift" process. The management actions include managing volunteers, lift requests and volunteer SMS service. The application is designed to include role management (admin, user) to allow several levels of management. <br><br>

The main problem that LifTOvers admin faces today is that there is too much administrative work required. This problem creates a slow turnaround time; food donors need to inform LiftOvers 24 hours ahead to request a "lift." Having an easily accessible dashboard of lift requests and volunteers will allow admin to keep the administrative work to a minimum. For example, our application is integrated with the existing SMS-messaging service, and we will automate the lift confirmation process once a volunteer verifies a lift through SMS. 


## Key Features
 * General features: 
    - Twilio backend SMS messaging integration, send/accept/decline requests through SMS messaging
    <br>
    <img src="./imgs/twilio.jpg" />
    - Different user authentication levels: admin, volunteer
    - Proper password storage & encryption using best practices
 * Admin features:
    - Add and delete volunteers through the web app.
    - Add and delete lifts through the web app.
    - Add and delete food banks through the web app.
    - Remove donors - donors are updated in real-time through SMS Twilio integration.
    - Change their profile settings & availability. 
    - Export a CSV file format for all data.
    - Promote volunteers to admin status, and change their information as needed.
    - An easy-to-understand graph on the admin dashboard to see key lift statistics. 
 * Volunteer features:
    - Accept lift requests from the website.
    - See their own history of past lifts. 
    - See the lift requests they are currently doing.
    - See all lifts that are available to accept.
    - Accept/cancel lift requests by text (Twilio).



## Instructions
 * Admin workflow: <br><br>
    When you first enter our application, you will be greeted with a login page. On this page, you may enter the admin account listed above. <br><br>
    To create a new admin account, you must create a new user and promote it through the preset admin account.<br><br>
    1)<strong> Logged in with given admin credentials (top of this section)</strong><br>
    The admin view will have a dashboard, lifts, volunteers, donors, food banks, edit volunteer, settings, and logout tabs on the left of the screen. Let us go through each option one by one.<br><br>
    <img src="./imgs/admin_login.gif" width="300" height="332" />

    - Dashboard:
        - This dashboard will display statistics about the current year pickups; no user interaction is needed to view 
        - There are details such as incomplete lift, # volunteers, complete lifts, cancelled lifts - as well as a graph that shows the aggregated statistics by month.
        ![Alt text](./imgs/dashboard.png "Dashboard Statistics")
    - Lifts:
        - This displays the list of lift requests that have been made
        - You can see the status of each request and the parties involved in each specific request
        - There’s a button to delete/add requests, as well as exporting the lift history
        ![Alt text](./imgs/lifts_management.gif "Dashboard Statistics")
    - Volunteers:
      - This page contains an aggregate view of all the volunteers that are registered in the database (includes the admins)
      - The option to delete/add volunteers, as well as exporting volunteer data
  ![Alt text](./imgs/volunteer_management.gif "Dashboard Statistics")
    - Donors:
      - This page contains an aggregate view of all the donors that have made a donation using liftovers
      - There is an option to delete donors, as well as exporting donor details
  ![Alt text](./imgs/donors_management.gif "Dashboard Statistics")
    - Food Banks:
      - This page contains an aggregate view of all the food banks that are associated with liftovers.
      - There is an option to delete/add food banks, as well as exporting existing food banks 
  ![Alt text](./imgs/foodbank_management.gif "Dashboard Statistics")
    - Edit Volunteer:
      - This page allows admins to change the account details for volunteers (i.e. name, postal code). 
      - Admin can also promote volunteers to admin status in this page
  ![Alt text](./imgs/edit_volunteer.gif "Dashboard Statistics")
    - Settings:
      - This page contains the details of the currently logged user. They can change their account details 
  ![Alt text](./imgs/settings.gif "Dashboard Statistics")

    - Logout:
      - Pressing this button will log you out of the application and will redirect you to the login page.
      ![Alt text](./imgs/logout.gif "Dashboard Statistics")

* Volunteer workflow: 

When you first enter our application, you will be greeted with a login page. On this page, you may enter the user account listed above or signup for a new account and log in afterwards. <br><br>
<img src="./imgs/user_signup.gif" width="270" height="332" />
<img src="./imgs/user_login.gif" width="300" height="332" />

After logging in, the user will be able to see the lift requests that need to be delivered. On the sidebar, there are tabs to see lift requests, in-progress lifts, completed lifts, settings, and logout. 
   * Lift requests:
     - This page shows all the requests that have not been accepted by a volunteer. Volunteers can choose a request they want to deliver and click on “deliver.” The accepted lift will be shown in their “in-progress” lifts. 
   ![Alt text](./imgs/take_lift.gif "Dashboard Statistics")

   * In-Progress:
     - Users will be able to see details for their upcoming lifts
   ![Alt text](./imgs/user_in_progress.png "Dashboard Statistics")

   * Complete:
     - Users can see their history of completed lifts.
   ![Alt text](./imgs/user_completed.png "Dashboard Statistics")

   * Settings: 
     - Similar to admin, users can change their availability and account details.
   ![Alt text](./imgs/user_settings.gif "Dashboard Statistics")

   * Logout:
     - Similar to admin, users can logout to the login page by pressing the logout button
   ![Alt text](./imgs/user_logout.gif "Dashboard Statistics")





 
 ## Development requirements
 Development should be compatible on Windows, MacOS, or Linux. <br>
 We suggest the following process to develop our code further: <br>
 Pull the code to a local repository. Open a terminal and run ```yarn install``` and ```yarn start``` in both the liftovers-develop-client (front-end) and liftovers-develop (back-end) folders. To push to a remote repo, all you have to do is push it to heroku, and heroku will take care of the rest of the deployment process. You must change the server links in the config files for both folders as well - change it to the new deployed locations. 
To develop locally, you can reach the front-end at localhost:3000 and the back-end at localhost:7000 (after running the two yarn commands above).





 ## Licenses 

 We will apply the MIT License to our codebase. This license grants permission to any person that has a copy of the software to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software. We want to give our partners full flexibility to change the software and modify it to their liking in the future, and license gives them the full freedom to develop the app in any manner they wish. <br><br>
 Reference link: [MIT license](https://opensource.org/licenses/MIT)