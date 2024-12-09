# Changes in Proposal
Our final project saw several changes from the original proposal, primarily to balance the intended features with technical feasibility and project constraints.

The original proposal included sentiment analysis and review summaries as features to assist organizers in making informed decisions based on user feedback. However, this component was removed in the final application because it required implementing machine learning techniques, which exceeded the project’s technical scope. Additionally, the dummy dataset used in the project lacked the detailed and diverse review data needed for meaningful sentiment analysis and summaries.

The proposal initially aimed to include a dynamic price negotiation feature, which allowed vendors and organizers to interact in real-time to settle on pricing. This was later simplified due to the complexity involved in implementing a live negotiation system. Instead, the final application provides users with the contact details of vendors and venues they are interested in, enabling them to negotiate independently outside the platform. This adjustment ensures functionality while reducing development complexity.

The final application enhanced the filtering capabilities for vendors and venues compared to the initial plan. Advanced queries were implemented to allow organizers to filter results based on specific criteria, such as budget, location, and event type. This refinement ensures a smoother user experience and aligns with the project’s goal of simplifying the event planning process.

# Usefulness of application
Our application successfully addressed its main goal of simplifying the event planning process by connecting event organizers with suitable venues and vendors. By providing a platform where users can interact and access tailored services, EventCupid achieved its purpose of streamlining the traditionally complex and fragmented task of event planning.

One of the key achievements of the application is its ability to allow users to add and manage their venues, vendors, and events seamlessly. Event organizers can filter venues and vendors based on criteria like price, location, capacity, and event type, helping them find options that meet their specific needs. Vendors and venue managers, on the other hand, can showcase their services and availability, making it easier for organizers to choose them. Additionally, the contact details feature bridges the gap between users, enabling direct communication for negotiations and event coordination.

However, the application fell short in implementing certain advanced functionalities like real-time price negotiation and sentiment analysis. These features, while initially planned, were beyond the technical and timeline constraints of the project. 


# Changes to our Schema
In the final schema, we added a foreign key reference from the VendorID column in the Vendors table to the UserID column in the Users table. This change was made to associate vendors with specific user accounts. By linking vendors to users, the application now allows users to directly manage their vendor profiles, ensuring a seamless experience when users log in to update, view, or manage their associated vendor information. This adjustment simplifies backend operations and aligns with the application's goal of providing a unified platform for managing user roles.

# Changes in our functionalities
A functionality to automatically create user profiles when new users logged in using Clerk was added. This streamlined the onboarding process and ensured that user data was correctly integrated into the database without manual intervention.

We originally planned to use machine learning for analyzing reviews, this feature was removed because it required complex algorithms and a diverse dataset, which was not feasible within the project’s scope. The dummy dataset used for development lacked sufficient real-world reviews for meaningful analysis, making this feature impractical.

The initial proposal included a feature for real-time price negotiation between organizers and vendors/venues. This was simplified in the final application to providing contact information for vendors and venues. The adjustment was made due to the complexity of implementing a dynamic negotiation system and the focus on core functionalities.


# Benefits of using advanced database programs in our database

The GetSuitableVendors stored procedure allows users to find vendors that meet their specific requirements. This procedure accepts inputs for a maximum base price and a desired service category, such as "Food" or "Music." It then searches the database for vendors who match these criteria and returns the results sorted by the lowest price first. For example, an organizer looking for a food vendor with a budget of $1,000 can use this feature to quickly identify suitable options. This eliminates manual filtering and ensures the most affordable choices are highlighted.

The constraints implemented in our database are pretty useful for keeping the data clean and accurate. Attribute-level constraints ensure that certain fields, like budgets in the Events table, always have positive values. This prevents errors that could cause issues later, such as negative budgets. The tuple-level constraint enforces that no two events can be scheduled at the same venue on the same day. This rule is particularly important for avoiding double bookings, which could disrupt event planning. Together, these constraints maintain order in the database and prevent problems before they arise.

Triggers, like ValidateReviewInsertion, ensure that only valid data is entered into the database. For instance, when a user adds a review, the trigger checks three key conditions: the rating must be between 1 and 5, the service being reviewed must exist in the database, and the review date cannot be in the future. If any of these conditions are not met, the trigger stops the insertion and provides a clear error message. This ensures that reviews are always accurate and relevant, which helps users trust the application’s feedback system when choosing services or vendors.

The AddNewEvent stored procedure not only adds a new event to the database but also performs several checks to enforce business rules. Before inserting the event, it verifies that the budget is positive and that the selected venue is available on the given date. It also checks if suitable vendors are available for the event date. If any of these checks fail, the procedure stops and returns a detailed error message. This process prevents incomplete or conflicting event entries and ensures the database stays consistent and accurate.

The advanced queries provide valuable insights that help users make informed decisions. One query identifies the top 15 venues based on their average review ratings, total service costs, and recent event activity. It filters out venues that do not meet a minimum capacity or service cost requirement and focuses on those with strong ratings and active use. This allows users to find high-performing venues that fit their needs. Another query lists upcoming events at large venues, making it easy for users to identify locations suitable for big gatherings. A third query compares vendors within the same service category, showing those with similar ratings. This gives organizers additional options when selecting vendors, helping them make better choices.

These advanced database programs work together to support our event management system.

# Our Technical Challenges

One user faced challenges while implementing constraints and integrating the edit venue functionality. Ensuring data integrity through constraints required careful design and testing. Hosting the database on Google Cloud Platform introduced issues with setting up secure and efficient access. Configuring GCP permissions and setting up the firewall rules to allow only authorized connections required careful planning. Future teams should prioritize stress testing their constraints with simulated loads and thoroughly document all GCP configurations for smooth integration.

Another user worked on advanced queries and user authentication revealed the complexity of combining user management with query optimization. Future teams should focus on indexing critical fields and testing queries against large datasets to ensure performance remains consistent as the application scales. Future teams should use indexing on frequently queried columns to improve performance, and test queries with a large dataset to identify bottlenecks. Plan the user schema early to handle various roles and scenarios cleanly.

Another user faced difficulties designing stored procedures like AddNewEvent to handle multiple validations and enforce business rules while maintaining atomicity. Ensuring these procedures integrated seamlessly with other database features required iterative testing and debugging. Future teams should break down stored procedures into smaller components during development to test individual validations. Use rollback mechanisms to handle failures gracefully and keep the database consistent.

The final user worked on transactions, ensuring proper rollback mechanisms in failure scenarios. Retrieving vendor data while maintaining performance required optimized queries and effective use of indexes to handle large datasets efficiently. Future teams should test transactions under different failure conditions to ensure proper rollback behavior. Optimize queries with proper indexing and avoid unnecessary JOIN conditions to maintain speed and reliability.

# Future improvements to our work
The current application allows users to contact vendors and venues for price discussions, but integrating an in-app price negotiation system would elevate user experience. This feature could enable real-time offer and counter-offer exchanges, providing a seamless and transparent platform for dynamic pricing. Future work could involve creating a dedicated database schema to store ongoing negotiations and a real-time messaging interface for communication.

Sentiment analysis and review summaries were initially proposed but removed due to technical constraints and data limitations. Future iterations could reintroduce this feature by collecting more comprehensive review data and leveraging machine learning algorithms. This would provide users with concise and meaningful insights, enhancing their decision-making process.

The current application supports displaying bundled services but does not include collaborative bundle creation between vendors and venues. Future work could implement this feature, allowing vendors to send collaboration requests and dynamically create bundled offerings. This would make the application more attractive to vendors and event organizers looking for comprehensive event solutions.


# Final division of work
The teamwork for our project was well managed.. We adopted agile sprints to organize tasks and used Git for version control, therefore ensuring that all contributions were streamlined and effectively merged. Regular check-ins and progress updates allowed everyone to stay informed and contribute meaningfully throughout the project.

GCP was a key enabler for effective teamwork. By centralizing the database, all team members could work with the same data, test queries, and ensure consistent results. This setup allowed seamless collaboration between the frontend and backend development, which was shared among all members.

The broad distribution of our work for this track is as follows
Aryaman- Entire GCP integration for database, Data modelling and creation, Edit functionalities, Triggers, advanced queries, Venues page
Lijun- Data modelling and creation, UML diagram preparation, User authentication and addition to database, advanced queries, login page frontend and backend integration
Sudarshan-Data modelling and creation, User deletion from database, Dataset creation, Transactions, Indexing, advanced queries, Events page
Sunveg- Data modelling and creation, Stored Procedures, Retrieve operations in the database, Indexing, advanced queries, keyword search, Vendors page

Although the responsibilities were clearly divided, everyone contributed to crafting the advanced queries, triggers, stored procedures, etc. Team members pitched ideas about indexing strategies and query optimization to ensure the application performed well under different scenarios. Specific areas, such as venues, vendors, and event hosts, were assigned to individuals to maintain focus and accountability. One team member handled user authentication and the functionality for storing new users in the database.

The divisions allowed each member to specialize in their assigned tasks while contributing to the overall project. At the same time, each team member stepped in to support each other when needed.







