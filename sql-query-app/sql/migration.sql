create database club;

use club;

-- Player table

drop table if exists manager_team;
drop table if exists player_team;
drop table if exists team_sponsor;
drop table if exists emergencycontact;
drop table if exists manager;
drop table if exists sponsor;
drop table if exists team;
drop table if exists stats;
drop table if exists player;
drop table if exists stadium;
drop table if exists owner;
drop view if exists player_list;

Create table player (
	PlayerID int Primary Key,
    First_Name varchar(50) not null,
    Last_Name varchar(50) not null,
    Middle_Name varchar(50),
    Phone varchar(20),
    DOB date,
    Age int,
    City varchar(50),
    State varchar(2),
    Zip varchar(10)
);

-- Emergency Contact table 

Create table EmergencyContact (
	EmergencyContactID int Primary Key,
    PlayerID int,
    First_Name varchar(50) not null,
    Last_Name varchar(50) not null,
    Phone varchar(20) not null,
    foreign key (PlayerID) references Player(PlayerID) on delete cascade on update cascade
);

-- Manager table

Create table Manager (
	ManagerID int Primary Key,
    First_Name varchar(50) not null,
    Last_Name varchar(50) not null,
    Middle_Name varchar(50),
    DOB Date,
    Age int
);

-- Owner table

Create table Owner(
	Owner_ID int primary key,
    First_Name varchar(50) not null,
    Last_Name varchar(50) not null,
    Middle_Name varchar(50) not null,
    DOB Date,
    Age int
);

-- Stadium table

Create table Stadium(
	Stadium_ID int Primary Key,
    Name varchar(100) not null,
    Capacity int,
    Fieldsize varchar(50),
    City varchar(50),
    State varchar(2),
    Zip varchar(10)
);

-- Sponsor table

Create table Sponsor(
	Sponsor_ID int Primary Key,
    Name varchar(100) not null,
    ContributionAmount decimal(10,2),
    Length_of_Sponsorship varchar(50)
);

-- Team table

Create Table Team(
	Team_ID int primary key,
	Team_Name varchar(100) not null,
	EstablishmentDate date,
    Ranking int,
    Games_Won int,
    Win_Rate Decimal(5,2),
    Team_Color varchar(100),
    Tournament int,
    Owner_ID int,
    Stadium_ID int,
    foreign key (Owner_ID) references Owner(Owner_ID) on delete set null on update cascade,
    foreign key (Stadium_ID) references Stadium(Stadium_ID) on delete set null on update cascade
 );
 
-- Stats Table
 
 create table Stats (
    StatsID int primary key,
    PlayerID int not null,
    Opponent_Team varchar(100) not null,
    Goals int,            
    Assists int,         
    Yellow_Card boolean default 0,  
    Red_Card boolean default 0,     
    foreign key (PlayerID) references Player(PlayerID) on delete cascade on update cascade
);
 
 -- Relationship table
 
-- Team_Sponsor junction table (One-to-One relationship)
 
 Create table Team_Sponsor(
	Team_ID int,
    Sponsor_ID int,
    primary key (Team_ID, Sponsor_ID),
    Foreign key (Team_ID) references Team(Team_ID) on delete cascade on update cascade,
    Foreign Key(Sponsor_ID) references Sponsor(Sponsor_ID)  on delete cascade on update cascade
 );
 
 
 -- Player_Team junction table (Many-to-One Relationship)
 
 Create table Player_Team (
	Player_ID int Primary Key,
    Team_ID int not null,
    Foreign key (Player_ID) references Player(PlayerID) on delete cascade on update cascade,
    foreign key (Team_ID) references Team(Team_ID)  on delete cascade on update cascade
 );
 
 -- Manager_Team junction table (One-to-One Relationship)
 
 Create table Manager_Team(
	Manager_ID int unique,
	Team_ID int unique,
	primary key (Manager_ID),
	foreign key (Manager_ID) references Manager(ManagerID) on delete cascade on update cascade,
	Foreign Key (Team_ID) references Team(Team_ID) on delete cascade on update cascade
 );
 
-- Value Insertion 

insert into Manager (ManagerID, First_Name, Last_Name, Middle_Name, DOB, Age)
values (1, 'Jose', 'Mourinho', '', '1963-01-26', 61);

insert into Owner(Owner_ID, First_Name, Last_Name, Middle_Name, DOB, Age)
values (1, 'Florentino', 'Perez', '', '1947-03-08', 77);

insert into Stadium(Stadium_ID, Name, Capacity, Fieldsize, City, State, Zip)
values (1, 'Sunshine Stadium', 20000, '110 x 75 yards', 'Orlando', 'FL', '32801');

insert into Sponsor(Sponsor_ID, Name, ContributionAmount, Length_of_Sponsorship)
values
(1, 'Tech Innovators Inc.', 50000.00, '2 years'),
(2, 'Green Energy Solutions', 75000.00, '3 years'),
(3, 'Healthy Life Foods', 30000.00, '1 year');  

-- Inserting 5 teams into the Team table
insert into Team(Team_ID, Team_Name, EstablishmentDate, Ranking, Number_Of_Players, Games_Won, Win_Rate, Team_Color, Tournament, Owner_ID, Stadium_ID)
values
(1, 'Falcon United', '2010-06-15', 5, 15, 0.68, 'Blue and Gold', 3, 1, 1),
(2, 'Thunderbolts', '2012-08-25', 3, 14, 0.70, 'Red and Black', 2, 1, 1),
(3, 'Raptors FC', '2014-11-05', 4, 12, 0.67, 'Green and White', 1, 1, 1),
(4, 'Viper Squad', '2016-05-10', 2, 19, 0.76, 'Purple and Black', 4, 1, 1),
(5, 'Lionheart Army', '2018-09-15', 6, 21, 0.70, 'Yellow and Blue', 5, 1, 1);

insert into Team_Sponsor (Team_ID, Sponsor_ID)
values
(1, 1),  
(1, 2),  
(1, 3);

insert into Player(PlayerID, First_Name, Middle_Name, Last_Name, Phone, DOB, Age, City, State, Zip)
values
('1', 'John', 'A.', 'Doe', '555-123-4567', '1990-05-15', 34, 'Springfield', 'IL', '62701'),
('2', 'Jane', 'B.', 'Smith', '555-234-5678', '1985-11-22', 38, 'Columbus', 'OH', '43215'),
('3', 'Emily', 'C.', 'Johnson', '555-345-6789', '1992-07-30', 32, 'Austin', 'TX', '73301'),
('4', 'Michael', 'D.', 'Williams', '555-456-7890', '1988-03-10', 36, 'Seattle', 'WA', '98101'),
('5', 'Sarah', 'E.', 'Brown', '555-567-8901', '1975-09-05', 48, 'Miami', 'FL', '33101'),
('6', 'David', 'F.', 'Clark', '555-678-9012', '1991-02-12', 33, 'Chicago', 'IL', '60601'),
('7', 'Olivia', 'G.', 'Martinez', '555-789-0123', '1994-01-25', 30, 'Los Angeles', 'CA', '90001'),
('8', 'James', 'H.', 'Taylor', '555-890-1234', '1987-08-17', 37, 'New York', 'NY', '10001'),
('9', 'Sophia', 'I.', 'Anderson', '555-901-2345', '1993-03-14', 31, 'Dallas', 'TX', '75201'),
('10', 'Ethan', 'J.', 'Thomas', '555-012-3456', '1990-09-07', 34, 'Phoenix', 'AZ', '85001'),
('11', 'Mason', 'K.', 'Jackson', '555-123-6789', '1989-06-19', 35, 'San Francisco', 'CA', '94101'),
('12', 'Isabella', 'L.', 'White', '555-234-7890', '1992-04-30', 32, 'Houston', 'TX', '77001'),
('13', 'Liam', 'M.', 'Harris', '555-345-8901', '1995-07-19', 29, 'Austin', 'TX', '73301'),
('14', 'Ava', 'N.', 'Lewis', '555-456-9012', '1996-12-05', 28, 'Boston', 'MA', '02101'),
('15', 'Lucas', 'O.', 'Young', '555-567-0123', '1986-11-20', 38, 'Miami', 'FL', '33101');

insert into Player_Team (Player_ID, Team_ID)
values
(1, 1),  -- John Doe, Team 1
(2, 1),  -- Jane Smith, Team 1
(3, 1),  -- Emily Johnson, Team 1
(4, 1),  -- Michael Williams, Team 1
(5, 1),  -- Sarah Brown, Team 1
(6, 2),  -- David Clark, Team 2
(7, 2),  -- Olivia Martinez, Team 2
(8, 2),  -- James Taylor, Team 2
(9, 2),  -- Sophia Anderson, Team 2
(10, 2), -- Ethan Thomas, Team 2
(11, 3), -- Mason Jackson, Team 3
(12, 3), -- Isabella White, Team 3
(13, 3), -- Liam Harris, Team 3
(14, 3), -- Ava Lewis, Team 3
(15, 3); -- Lucas Young, Team 3

insert into EmergencyContact (EmergencyContactID, PlayerID, First_Name, Last_Name, Phone)
values
(1, 1, 'Mary', 'Doe', '555-987-6543'),     
(2, 2, 'Robert', 'Smith', '555-876-5432'), 
(3, 3, 'Linda', 'Johnson', '555-765-4321'),
(4, 4, 'James', 'Williams', '555-654-3210'),
(5, 5, 'Anna', 'Brown', '555-543-2109');  

insert into Manager_Team(Manager_ID, Team_ID)
values (1, 1);

insert into Stats (StatsID, PlayerID, Opponent_Team, Goals, Assists, Yellow_Card, Red_Card)
values
(1, 1, 'Manchester United', 2, 1, 0, 0),
(2, 1, 'Real Madrid', 1, 0, 1, 0),
(3, 1, 'Liverpool', 0, 2, 0, 0),
(4, 2, 'FC Barcelona', 0, 1, 1, 0),
(5, 2, 'Chelsea', 1, 1, 0, 1),
(6, 2, 'Atletico Madrid', 1, 0, 1, 0),
(7, 3, 'Arsenal', 3, 0, 0, 0),
(8, 3, 'Valencia', 0, 1, 0, 1),
(9, 3, 'Sevilla', 1, 1, 0, 0),
(10, 4, 'Tottenham Hotspur', 2, 1, 0, 0),
(11, 4, 'Real Betis', 1, 0, 1, 0),
(12, 4, 'Manchester City', 0, 0, 0, 1),
(13, 5, 'Villareal', 0, 0, 1, 0),
(14, 5, 'Leeds United', 2, 2, 0, 0),
(15, 5, 'Real Sociedad', 1, 0, 0, 0);

-- Quering Different Outputs

-- view list of players
create view player_list
 as
    select playerid, first_name, last_name, team_name
	from player
	join player_team on player.playerid = player_team.player_id
	join team on player_team.team_id = team.team_id;

select * from player_list;

-- drop and add Team Color column from Team
alter table team drop column Team_Color;
alter table team add column Team_Color varchar(100);

-- drop Emergency Contact table
drop table EmergencyContact;

-- select youngest player of a team
select first_name, last_name, age, team_name
from player
join player_team on player.playerid = player_team.player_id
join team on player_team.team_id = team.team_id
where player.age = (select min(age) from player);
                    
                    
-- Quering Player stat

select 
    Player.First_Name,
    Player.Last_Name,
    Stats.Opponent_Team,
    Stats.Goals,
    Stats.Assists,
    Stats.Yellow_Card,
    Stats.Red_Card
from 
    Player
join 
    Stats on Player.PlayerID = Stats.PlayerID
where 
    Player.PlayerID = 1;
    
select * from stats
