var database;
var dog,sadDog,happyDog;
var feedthedog,addfood;
var foodObj;
var feed,addfood;
var lastFed,FeedTime;
var milkbottle,milkImg;
var namebox;
var foodS;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
  milkImg = loadImage("Milk.png");
}

function setup() {
  createCanvas(1000,400);
  
  database = firebase.database();

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  namebox = createInput('').attribute('placeholder','Your pet name');
  namebox.position(900,150);

  milkbottle = createSprite(720,215)
  milkbottle.addImage(milkImg)
  milkbottle.visible = 0;
  milkbottle.scale = 0.1

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addfood = createButton("Add Food");
  addfood.position(800,95);
  addfood.mousePressed(addFoods);
}

function draw() {
  background(46,139,87);

  //Displaying last fed
  feedTime=database.ref('FeedTime');
  feedTime.on("value",function(data){
    lastFed=data.val();
  })

fill(255,255,254);
textSize(25);
if(lastFed >= 12){
  text("Last Fed : " + lastFed % 12 + "PM",250,30);
}else if(lastFed === 0){
  text("Last Fed : 12 AM",350,30);
}else{
  text("Last Fed : " + lastFed + "AM",250,30);
}

  foodObj.display()
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(happyDog);
  }
  else{
    dog.addImage(happyDog);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
        dog.addImage(happyDog);
    }
    else
    milkbottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}  
 
//function to add food in stock
function addFoods(){
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}
