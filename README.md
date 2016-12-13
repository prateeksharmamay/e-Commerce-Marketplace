# e-Commerce-Marketplace

Marketplace project is inspired by eBay MarketPlace.
This application is made just for the purpose of learning new concepts.

<h3>Modules performed following tasks:</h3>
<h6><h6>1. Basic User functionalities:</h6>
a. Sign up the new users (First name, Last name, Email, Password). Passwords have to be encrypted<br />
b. Sign in with existing users<br />
c. Sign out<br />

<h6>2. Profile:</h6>
a. About: Birthday, Ebay handle, contact information and location<br />
b. Should be able to store user’s advertisements for others to read. This should at-least includes the item name, item description, seller information, item price and quantity. (Only text, no images).<br />
E.g. Advertisement – “Laptop”, “2.2 GHz Core 2 Duo, 2GB RAM…”, “Jon Smith, shipping from NY”, “$600”, “4 pieces”<br />
c. Should give all the advertisements details to all the other users.<br />
d. Users can bid the product displayed by other users. Bidding takes place over 4 days. For some items, you can purchase without bidding. You should take care of quantities and should respectively reflect user accounts in case of any transaction.<br />
e. Shopping Cart should be maintained which will reflect temporary items. Users should be able to add, remove items from the cart until checkout.<br />
f. Checkout should deduct and add items from seller and buyer respectively.<br />
g. Should perform simple credit card validations on payment. (check to be sure the number entered is16 digits)<br />
h. Users account should reflect all the bought and sold items.<br />
i. Should maintain time last logged in and should be returned back when user logs in.<br />
j. User tracking: Generate logs into a file when user clicks any place in the web page. There are generally two major logs. Event Logs: record timestamp, userid, click object id, any descriptions. Bidding Logs (periodic logs of bidding process) timestamp, item id, user id, bid amount.<br />

<h6>3. Implement Connection pooling for database access</h6>
