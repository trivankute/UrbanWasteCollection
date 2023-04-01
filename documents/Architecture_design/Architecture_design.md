# **Task 3 Architecture design**


<br>


## **3.1 Use a layered architecture to design the UWC 2.0 system. Describe how will you present your User Interface. Describe how will you store your data. Describe how you will access to external services/ APIs.**
<br>


### **3.1.1 Description**
<br>
<p align="center">
    <img style="width:500px; height:500px;" src="../../pictures/Task3/3-1.png?raw=true" alt="3-1.png"/>
</p>
<br>

The layered architecture style is one ofthe most common architectural styles. The idea behind Layered Architecture is that modules or components with similar functionalities are organized into horizontal layers. As a result, each layer performs a specific role within the application.\

The layered architecture style does not have a restriction on the number oflayers that the application can have, as the purpose is to have layers that promote the concept ofseparation of concerns. The layered architecture style abstracts the view ofthe system as a whole while providing enough detail to understand the roles and responsibilities ofindividual layers and the relationship between them.\

Vocabulary for components and connectors:
- The connector between each layer can be a function call, a query request, a data object or any connector that conveys request or information. 
- The naming oflayers is quite flexible, but usually a presentation layer, a business layer and a physical layer are always present.
- The presentation layer contains all ofthe classes responsible for presenting the UI/visualization to the end-user and handling bowser communication logic. Ideally, this is the only layer that customers interact with.
- The business/logic layer contains all the logic that is required by the application to meet itsfunctional requirements. This layer usually deals with data aggregation, computation and query requests. This is where the main logic ofthe application is represented.
- The data/physical + persistence layer is where retrievable information is stored. This layer consists of both logical and physical aspects. While the logical schema specifies conceptual model of data, the physical schema implements the logical model into physical database platform.

Topological constraints:
- The architecture itselfis a topological constraint as it is a specific way of organizing the software systems.
- Connecters only interact with two layers, and usually, no skipping oflayers is allowed.
- Communication is usually between one user and one interface/system.
- Data flow goes two ways (user to system, and back).

Resilience to change: Since the separation of concerns is the main property ofthe architecture, each layer of software has a specific function. This makes updating individual layers easy, and also allows teams to separate workloads.

Negative behaviours
- Layered software usually results in tightly coupled software components, and monolithic applications.
- Security can become an issue if bypassing layers is allowed. The Business Layer usually acts as an integrity check for passing data.
- If not properly designed and managed, communication between layers can become complicated.

Supported:
- Easy to implement/test: Layered architecture is one ofthe easiest structures to implement. Since every layer has a specific function, testing is easy since layers can be mocked
- Flexibility: In some sense, any software can be abstracted into layers. Layered architecture is very open and broad in its implementation, thus leading to many practical applications. 
- Security: Security can be implemented at every layer. Iflayers are skipped, extra precautions must be made.

Inhibited:
- Low scalability: Layered architecture results in a rigid structure ofsoftware implementation and highly coupled software groups, resulting in a system that is hard to scale and hard to update. A change to a single layer must be verified that it does not crash the entire system.
- Low Performance: Data must travel through every layer and processed, slowing down the performance

Comparison with other architectures 
- Client-server, layered, and pipe and filter architectures are similar in their objective.
- Client-server can be thought of as a variation oflayered architecture with two layers.
- Pipe and filter only allow unidirectional flow of information, whereas client-server and layered architectures allow bidirectional flow


**[External link](https://cs.uwaterloo.ca/~m2nagapp/courses/CS446/1195/Arch_Design_Activity/Layered.pdf?fbclid=IwAR0Qt55ecbyfu4jvbPrlZJWZ3urH8LQaktXrfckPCPKLe0SdaGLlc3p-yhM)**


<br>
<p align="center">
    <img style="width:800px; height:500px;" src="../../pictures/Task3/3-2.png?raw=true" alt="3-2.png"/>
</p>
<br>
For more details, in this Layered Architecture design, we will describe everything we intend to do in every layer
<br>

<br>

### **3.1.2 Presentation Layer**
<br>
We will implement “Web UI” or “User Interface” with ReactJS. Initially, our team design Figma for first visualization. Then, we will typically use React components to create all small components which we could create when first looking at the Figma design. After that, we will integrate those components into pages with navigation and effects like hover or transitions. When the whole front-end is completed, we will think of how the data will flow across the pages and decide where to put “Axios” functions to call APIs to the server with Redux.\
External link for detail approach:
- Khuat, Tung. (2018). Developing a frontend applicationusing ReactJS and Redux. From **[External link](https://core.ac.uk/download/pdf/161432422.pdf)**
- Udemy. (4/2020). React JS- Complete Guide for Frontend Web Development. From **[External link](https://www.udemy.com/course/react-js-a-complete-guide-for-frontend-web-development/)**
- ProgrammingKnowledge. (2021). ReactJS Frontend Web Development | Learn By Building Projects (including Hooks, React Router, Redux). **[External link](https://www.youtube.com/watch?v=HT82p_re-EY)**
<br>
<br>

### **3.1.3 Server Layer**
<br>

In the future, we will implement the server using ExpressJS, a popular Node.js framework for building web applications. To structure our server-side code, we will use Routing modules to define the endpoints of our API, Middleware modules to handle common tasks such as authentication and error handling, Controllers to handle the business logic of each endpoint, and Services to handle more complex logic or interact with external services.
To start, we will create a new Express application and define our first routes. We will then create Middleware modules to handle tasks such as authentication and logging. We will also create Controllers for each endpoint, where we will define the logic to handle requests and responses. The Controllers will interact with Services to handle more complex tasks, such as querying a database or interacting with external services.
Once we have our basic architecture in place, we will continue to refine and expand our server as needed. We may add additional Middleware modules to handle more complex tasks, or add new Controllers and Services as our application grows. Throughout the development process, we will test our server thoroughly to ensure that it is reliable, efficient, and secure.
External link for detail approach:
- freeCodeCamp.org. (2022). Node.js and Express.js – Full course. From **[External link](https://www.youtube.com/watch?v=Oe421EPjeBE)**
- Web Dev Simplified. (2022). Learning Express.js in 35 minutes. From **[External link](https://www.youtube.com/watch?v=SccSCuHhOw0)**
- mrtwinklesharma. (06/07/2022). Steps to create an Express.js Application. **[External link](https://www.geeksforgeeks.org/steps-to-create-an-express-js-application/)**

<br>

### **3.1.4 Data Layer**
<br>

For the next phase of development, we will implement the Data Layer using MongoDB. First, we will design the database schema and determine the relationships between collections. Then, we will use a MongoDB driver to connect our server with the database. We will create Models for each collection and use them to interact with the database. These Models will contain methods to perform CRUD operations on the data. We will also implement database indexes for better performance. Finally, we will handle errors and exceptions that might occur while interacting with the database.

On the other hand, data can be stored using collections, which are analogous to tables in a relational database. Each collection can store documents in JSON-like format, which can be flexible and schema-less. The data can be structured in a way that makes sense for the specific application needs, and queries can be run against the collections to retrieve and manipulate the data. Additionally, MongoDB provides features like indexing and aggregation to optimize query performance and provide additional functionality.

- Beginners Guide: MongoDB Basics. From **[External link](https://www.mongodb.com/basics)**
- Intellipaat. (2022). MongoDB from Scratch. From  **[External link](https://www.youtube.com/watch?v=_DfcVjuMFzM)**
- Indian Coders. (2022). NodeJS Express MongoDB Tutorial For Beginners | REST API Tutorial. From **[External link](https://www.youtube.com/watch?v=VT20NTbn6U4)**

For the important question of accessing external services or APIs
- Our approach will involve working primarily in the server layer. We will use an HTTP client library in Node.js such as Axios, which we can import the library in our server code and make HTTP requests to the external services or APIs by specifying the URL, request method, headers, and body. 
- We will also handle the response from the external services or APIs in our server code and perform further actions or data processing based on the response. 
-  Additionally, we may need to handle errors or exceptions that may occur during the request or response process.
-  Overall, we believe that putting this functionality in the server layer is the best choice.

<br>


## **3.2  Draw an implementation diagram for Task Assignment module.**
<br>

### **3.2.1 Module gán phương tiện đến collector và Janitor**
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-1.png?raw=true" alt="3.2-1.png"/>
</p>
<br>
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-2.png?raw=true" alt="3.2-2.png"/>
</p>
<br>

### **3.2.2 Module chỉ định công việc cho collectors và janitors**


<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-3.png?raw=true" alt="3.2-3.png"/>
</p>
<br>

<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-4.png?raw=true" alt="3.2-4.png"/>
</p>
<br>

### **3.2.3 Module tạo tuyến đường cho collectors và janitors**


<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-5.png?raw=true" alt="3.2-5.png"/>
</p>
<br>

- **Delete point**
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-6.png?raw=true" alt="3.2-6.png"/>
</p>
<br>

<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-7.png?raw=true" alt="3.2-7.png"/>
</p>
<br>

- **Assign point**
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-8.png?raw=true" alt="3.2-8.png"/>
</p>
<br>

- **Create point**
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-9.png?raw=true" alt="3.2-9.png"/>
</p>
<br>

### **3.2.4 Module gửi tin nhắn cho collectors và janitors**

<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-10.png?raw=true" alt="3.2-10.png"/>
</p>
<br>

- **Phan hoi**
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-11.png?raw=true" alt="3.2-11.png"/>
</p>
<br>

- **Xac nhan gui tin nhan**
<br>
<p align="center">
    <img  src="../../pictures/Task3/3.2-12.png?raw=true" alt="3.2-12.png"/>
</p>
<br>
