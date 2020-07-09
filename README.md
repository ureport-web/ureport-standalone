# UReport Server
### Stand alone server side reporting and analyzing software for local or CI automation.
[Demo](https://ureport-demo.herokuapp.com/#/)
Username/password: operator/password

If you need to admin permission, please contact ureport@outlook.com

# Prerequiste
- MongoDB (> 3.0)
- Nodejs (> 12.0)
    - [Nodejs site](https://ureport-demo.herokuapp.com/#/)

# How to install
1. Download or clone the repo.
2. Open a terminal
3. cd to the loaction of the repo
4. Run `npm install`
5. Go to config folder, change DBHost and PORT if it is different from the given one
    + If you need to deploy is as prod, please modify the file **production.json**
6. Run `npm install --global coffeescript`
6. Run `coffee initalization.coffee ` to initilize db (You can edit the payload in the file if you want provide different user information)
7. Run `npm start` to start the server
8. Open browser and go to http://localhost:4100 to start using the application
    + By default, there is one admin user created for you with credential admin/1234. You can change it in the app or use API to add addtional user.

# Overview
This repo include everything you need to setup your UReport server. And it is production ready to be used once you have downloaded. You have access to all the backend server code as well.

# Features
<h4 class="display-5"><i class="fas fa-microscope"> Auto Analysis</i></h2>
<p class="lead">Never do the same work twice!</p>
<p>Start your day with all of your repeated failures already analyzed.</p>
<p>UReport allows you to save big on time and effort by auto analyzing and retagging the failures that were studied and tagged in a previous run.</p>

![image info](./dist/assets/images/auto_1.png)
![image info](./dist/assets/images/auto_2.png)

<h4 class="display-5"> <i class="fa fa-wrench"> Customize Dashboard</i></h2>
<p class="lead">No need to search hard for the info you need!</p>
<P>Our customizable dashboard allows you to get the stats you want as soon as you open UReport!</P>You can use our user friendly module to create your own bar charts, line charts and tables to see the pass rates, fail rates, percentage of skipped tests and analyzed tests.

![image info](./dist/assets/images/cd_1.png)
![image info](./dist/assets/images/cd_4.png)

<h4 class="display-5"> <i class="fas fa-balance-scale"> Compare different product</i></h2>
<p class="lead">When you need to compare the results of different runs or even different products, you can use one of UReport’s modules to either create a table or a chart to compare stats.</p>
<p>You can also simply split the screen in 2 and compare the results side by side! </p>

![image info](./dist/assets/images/cdf_1.png)
![image info](./dist/assets/images/cdf_2.png)

# How to send test data to UReport
UReport offers various API for you to adjust your automation framework to send data.
There are two important collections you need to know about for you to send your data.
<br>
**Build and Test**
<P>Build is a collection holds all your executions. It is named as Build to reflect the build numnber your CI software generated when buidling your application and executing automation tests
<br> 
Test is a collections holds all your tests belongs to a specifc build
<br>
Once you deploy the server, you can go to http://your-server:your-port/api-docs/

<!-- # What to contribute to UI?
Check out our UI repo -->