$(document).ready(function() {
    var characters = {
        "Obi-Wan Kenobi": {
            name: "Obi-Wan Kenobi",
            health: 120,
            attack: 8,
            imageUrl: "./assets/images/obi-wan.jpg",
            enemyAttackBack: 15,
        },
        "Luke Skywalker": {
            name: "Luke Skywalker",
            health: 100,
            attack: 14,
            imageUrl: "./assets/images/luke-skywalker.jpg",
            enemyAttackBack: 5,
        },
        "Darth Sidious": {
            name: "Darth Sidious",
            health: 150,
            attack: 8,
            imageUrl: "./assets/images/darth-sidious.png",
            enemyAttackBack: 20,
        },
        "Darth Maul": {
            name: "Darth Maul",
            health: 180,
            attack: 7,
            imageUrl: "./assets/images/darth-maul.jpg",
            enemyAttackBack: 25,
        },
    };
    var attacker;
    // Populated with all the characters the player didn't select.
    var combatants = [];
    // Will be populated when the player chooses an opponent.
    var defender;
    // Will keep track of turns during combat. Used for calculating player damage.
    var turnCounter = 1;
    // Tracks number of defeated opponents.
    var killCount = 0;
    //Display on screen
    let renderCharacter = function(character, section) {
        var card = $(`<div class="character" data-name="${character.name}">`);
        var name = $(`<div class='character-name'>`).text(character.name);
        var image = $(`<img alt='${character.name}' class='character-image'>`).attr(
            "src",
            character.imageUrl
        );
        var health = $(`<div class='character-health'>`).text(character.health);
        card.append(name, image, health);
        $(section).append(card);
    };
    // Show characters
    let initializeGame = function() {
        $.each(characters, function(index, character) {
            renderCharacter(character, "#characters-section");
        });
    };
    initializeGame();

    // Show enemies
    let renderEnemies = function(combatants) {
        $.each(combatants, (index, enemy) => {
            renderCharacter(enemy, "#available-to-attack-section");
        });
    };
    let updateCharacter = function(obi, section) {
        $(section).empty();
        renderCharacter(obi, section);
    };

    // Function to handle rendering game messages.
    var renderMessage = function(message) {
        // Builds the message and appends it to the page.
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
    };

    var clearMessage = function() {
        var gameMessage = $("#game-message");

        gameMessage.text("");
    };

    var reset = function(result) {
        // When the 'Restart' button is clicked, reload the page.
        var restart = $("<button>Restart</button>").click(function() {
            location.reload();
        });

        var gameState = $("<div>").text(result);

        $("body").append(gameState)
        $("body").append(restart);
    };
    /* 
=============
Event listeners
=============
*/
    $("#characters-section").on("click", ".character", function() {
        var selectedCharacter = $(this).attr("data-name");
        if (!attacker) {
            attacker = characters[selectedCharacter];
            for (var key in characters) {
                if (key !== selectedCharacter) {
                    combatants.push(characters[key]);
                }
            }
        }

        $("#characters-section").hide();
        updateCharacter(attacker, "#selected-character");
        renderEnemies(combatants);
    });

    $("#available-to-attack-section").on("click", ".character", function() {
        var selectedEnemy = $(this).data("name");
        if ($("#defender").children().length === 0) {
            defender = characters[selectedEnemy];
            $(this).remove();
            updateCharacter(defender, "#defender");
        }
    });

    $("#attack-button").click(function() {
        if ($("#defender").children().length !== 0) {
            var attackMessage =
                "You attacked " +
                defender.name +
                " for " +
                attacker.attack * turnCounter +
                " damage.";
            var counterAttackMessage =
                defender.name +
                " attacked you back for " +
                defender.enemyAttackBack +
                " damage.";
            clearMessage();
            defender.health -= attacker.attack * turnCounter;

            if (defender.health > 0) {
                updateCharacter(defender, "#defender");

                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                attacker.health -= defender.enemyAttackBack;
                updateCharacter(attacker, "#selected-character");

                if (attacker.health <= 0) {
                    clearMessage();
                    reset("You have been defeated...GAME OVER!!!");
                    $("#attack-button").off("click");
                }
            } else {
                $("#defender").empty();

                var gameStateMessage =
                    "You have defeated " +
                    defender.name +
                    ", you can choose to fight another enemy.";
                renderMessage(gameStateMessage);

                killCount++;

                if (killCount >= combatants.length) {
                    clearMessage();
                    $("#attack-button").off("click");
                    reset("You Won!!!! GAME OVER!!!");
                }
            }
            turnCounter++;

        } else {
            // If there is no defender, render an error message.
            clearMessage();
            renderMessage("No enemy here.");
        }



    });


});