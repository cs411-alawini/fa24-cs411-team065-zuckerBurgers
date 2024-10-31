# Database Implementation
## 1. Database Connection
<!-- ![connection](./doc/connection.png) -->
![show_db_tables](./show_db_tables.png)


## 2. Table Structure and DDL Commands
```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Username VARCHAR(50),
    Email VARCHAR(100),
    PhoneNumber VARCHAR(20),
    UserType ENUM('Organizer', 'Manager')
);

CREATE TABLE ServiceBundles (
    BundleID INT PRIMARY KEY,
    BundlePrice DECIMAL(10, 2)
);

CREATE TABLE Venues (
    VenueID INT PRIMARY KEY,
    ManagerID INT,
    VenueName VARCHAR(100),
    Address VARCHAR(500),
    MaxCapacity INT,
    FOREIGN KEY (ManagerID) REFERENCES Users(UserID)
);

CREATE TABLE Vendors (
    VendorID INT PRIMARY KEY,
    VendorName VARCHAR(100),
    ServiceCategory VARCHAR(50),
    Description VARCHAR(500),
    BasePrice DECIMAL(10, 2)
);

CREATE TABLE Services (
    ServiceID INT PRIMARY KEY,
    VendorID INT DEFAULT NULL,
    BundleID INT DEFAULT NULL,
    ServiceName VARCHAR(100),
    Description VARCHAR(500),
    Price DECIMAL(10, 2),
    FOREIGN KEY (VendorID) REFERENCES Vendors(VendorID) ON DELETE CASCADE,
    FOREIGN KEY (BundleID) REFERENCES ServiceBundles(BundleID) ON DELETE CASCADE
);

CREATE TABLE Events (
    EventID INT PRIMARY KEY,
    VenueID INT,
    OrganizerID INT,
    EventName VARCHAR(100),
    EventType VARCHAR(50),
    EventDate DATE,
    Budget DECIMAL(10, 2),
    Description VARCHAR(500),
    FOREIGN KEY (VenueID) REFERENCES Venues(VenueID) ON DELETE CASCADE,
    FOREIGN KEY (OrganizerID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY,
    ServiceID INT,
    VenueID INT,
    UserID INT,
    Rating INT,
    Comment VARCHAR(1000),
    ReviewDate DATE,
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID) ON DELETE CASCADE,
    FOREIGN KEY (VenueID) REFERENCES Venues(VenueID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
```

## 3. Table Counts

![counts](./counts.png)


# Advanced Queries
## Query 1
- The purpose of this query is to retrieve the top 15 venues that have an average review rating of at least 2, along with their addresses, total service costs, and the number of recent events hosted by organizers. The query filters for venues with a maximum capacity greater than 50, includes only recent reviews (from September 10, 2024, onward), and considers venues that have a total service cost exceeding 100. It aims to identify venues that are well-rated and actively hosting events while ensuring a reasonable service cost.

- Index on : v.MaxCapacity, r.ReviewDate, (r.ReviewDate, r.Rating)
CREATE INDEX idx_venues_maxcapacity ON Venues (MaxCapacity);

CREATE INDEX idx_reviews_reviewdate ON Reviews (ReviewDate);

CREATE INDEX idx_reviews_reviewdate_rating ON Reviews (ReviewDate, Rating);


```sql
SELECT 
    v.VenueName,
    v.Address,
    AVG(r.Rating) AS AvgRating,
    COUNT(r.ReviewID) AS ReviewCount,
    SUM(s.Price) AS TotalServiceCost,
    (SELECT COUNT(*) 
     FROM Events e 
     JOIN Users u ON e.OrganizerID = u.UserID
     WHERE e.VenueID = v.VenueID 
       AND e.EventDate >= '2024-01-01'
    ) AS RecentOrganizerEvents
FROM 
    Venues v
JOIN 
    Reviews r ON v.VenueID = r.VenueID
JOIN 
    Services s ON s.BundleID IN (
        SELECT BundleID 
        FROM ServiceBundles
        WHERE BundlePrice > 50
    )
WHERE 
    v.MaxCapacity > 50
    AND r.ReviewDate >= '2024-09-10'
    AND r.Rating >= 2  -- only high-rated reviews
GROUP BY 
    v.VenueID
HAVING 
    AVG(r.Rating) >= 2.0
    AND RecentOrganizerEvents >= 2  -- Only venues with at least 3 recent organizer-hosted events
    AND TotalServiceCost > 100  -- Only  venues with bundled services over a certain cost
ORDER BY 
    AvgRating DESC, 
    ReviewCount DESC
LIMIT 15;

```
![adv_1][./adv_1.png]

## Query 2
- This query helps identify the most active event organizers by summarizing their performance metrics, such as total events, budgets, and reviews. By focusing on organizers who host events in larger venues and have a substantial number of events, it provides insights into which organizers are effectively managing events and could be valuable partners for future collaborations or promotions. This information can aid decision-making for event planning, marketing strategies, and resource allocation.

```sql
SELECT 
    u.Username,
    COUNT(e.EventID) AS EventCount,
    SUM(e.Budget) AS TotalBudget,
    AVG(e.Budget) AS AvgBudget,
    (SELECT COUNT(*) 
     FROM Reviews r 
     WHERE r.UserID = u.UserID) AS ReviewCount,
    (SELECT COUNT(*) 
     FROM Events e2 
     WHERE e2.OrganizerID = u.UserID AND e2.EventDate >= '2024-01-01') AS RecentEventsCount
FROM 
    Users u
JOIN 
    Events e ON u.UserID = e.OrganizerID
JOIN 
    Venues v ON e.VenueID = v.VenueID
WHERE 
    u.UserType = 'Organizer'
    AND e.EventDate >= '2023-01-01'  -- Only consider events from the last year
    AND v.MaxCapacity > 80  -- Only include events in larger venues
GROUP BY 
    u.UserID
HAVING 
    EventCount > 2  -- Only include organizers with more than 2 events
ORDER BY 
    EventCount DESC, TotalBudget DESC
LIMIT 15;



```
![adv_2][./adv_2.png]

## Query 3
- This query retrieves venues with a capacity greater than 100 and filters for upcoming events on or after 2024-09-17, without restricting the results to a specific manager. 

```sql
SELECT 
    v.VenueName,
    COUNT(e.EventID) AS TotalEvents,
    AVG(e.Budget) AS AverageBudget
FROM 
    Venues v
JOIN 
    Events e ON v.VenueID = e.VenueID
WHERE 
    v.MaxCapacity > 100  -- venues with capacity greater than 100
    AND e.EventDate >= '2024-09-17'  -- Filter for upcoming events
GROUP BY 
    v.VenueID
ORDER BY 
    TotalEvents DESC
LIMIT 15;

```
![adv_3][./doc/adv_3.png]

## Query 4
- This query lists vendors within the same service category who have similar ratings, allowing organizers to explore comparable options.

```sql
SELECT 
    v1.VendorName AS Vendor1,
    v2.VendorName AS Vendor2,
    v1.ServiceCategory,
    AVG(r1.Rating) AS Vendor1AverageRating,
    AVG(r2.Rating) AS Vendor2AverageRating,
    ABS(AVG(r1.Rating) - AVG(r2.Rating)) AS RatingDifference
FROM 
    Vendors v1
JOIN 
    Services s1 ON v1.VendorID = s1.VendorID
JOIN 
    Reviews r1 ON s1.ServiceID = r1.ServiceID
JOIN 
    Vendors v2 ON v1.ServiceCategory = v2.ServiceCategory AND v1.VendorID != v2.VendorID
JOIN 
    Services s2 ON v2.VendorID = s2.VendorID
JOIN 
    Reviews r2 ON s2.ServiceID = r2.ServiceID
GROUP BY 
    v1.VendorID, v2.VendorID
HAVING 
    RatingDifference <= 0.5 --  vendors with close average ratings
ORDER BY 
    v1.ServiceCategory, RatingDifference
LIMIT 15;



```
![adv_4][./adv_4.png]


# Indexing 

- query 1 :
![q1_1][./q1_1.png]
![q1_2][./q1_2.png]
![q1_3][./q1_3.png]
![q1_4][./q1_4.png]
- query 2 :
![q2_1][./q2_1.png]
![q2_2][./q2_2.png]
- query 3 :
![q3_1][./q3_1.png]
![q3_2][./q3_2.png]
- query 4 :
![q4_1][./q4_1.png]
![q4_2][./q4_2.png]
## Indexing effect:
- Given the findings from the analysis, the indexing strategy implemented did not yield noticeable performance enhancements for the query due to the small dataset size and the nature of the filtering operations. In larger datasets, these indexes would typically improve performance by reducing the time complexity associated with the joins and filtering operations. However, in this case, it appears that the dataset's size allows for efficient processing through direct access, resulting in little to no difference in performance.


