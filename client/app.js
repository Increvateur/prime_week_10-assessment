var animalArray = [];
var animalData = {};

$(document).ready(function() {

  $.ajax({
    type: 'GET',
    url: '/animals',
    success: function(animals) {
      animalData = animals;
      console.log(animalData)
      initialDisplay();

    }
  });

  $("#animalForm").on("submit", function(event) {
    event.preventDefault();

    var formArray = $('form').serializeArray();
    formArray.forEach(function(element){
      animalData[element.name] = element.value;
      animalData.amount = 20;
      console.log(animalData);
    });

    $('#animalForm').find('input[type=text]').val('');
    console.log(animalData);
    postAnimals(animalData);

  });


})

function postAnimals(input) {
  $.ajax({
    type: 'POST',
    url: '/animals',
    data: input,
    success: function(input) {
      console.log("Success!", input);
    }

  });
}

// $.ajax({
//   type: 'GET',
//   url: '/animals',
//   success: function(data) {
//     employeeArray = data;
//     salaryCalc();
//     initialDisplay();
//   }
// });

function returnedData(input) {
  animalArray.push(input);
  displayOutput(input);
}

function initialDisplay(){

  for (var i = 0; i < animalArray.length; i++) {
    $(".animal-display").append('<div class="animal-' + (i + 1) + '"></div>');
    var $el = $(".main").children().last();

    $el.append("<li>" + animalArray[i].animal + "</li>");
    $el.append("<li>Current Amount: " + animalArray[i].amount + "</li>");

  };
}

function displayOutput(input){

  $(".animal-display").append('<div class="animal-' + animalArray.length + '"></div>');
  var $el = $(".main").children().last();

  $el.append("<li>" + input.animal + "</li>");
  $el.append("<li>Current Amount: " + input.amount + "</li>");

};

function randomNumber() {
  $.ajax({
    type: 'GET',
    url: '/random',
    success: function(data) {
      console.log("Success RANDOM NUMBER!", data);
      var number = data;

    }

  });
}
