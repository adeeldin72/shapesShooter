//get canvas element
const canvas = document.querySelector('canvas');

//change canvas size
canvas.width = innerWidth;
canvas.height = innerHeight;

// console.log(canvas);

//used to draw on the canvas this is the canvas context
const ctx = canvas.getContext('2d'); //2d game so 2d content

//player class
class Player {
    constructor(x, y, radius, color) { //this is the constructor used to create the player
        this.x = x,
            this.y = y,
            this.radius = radius,
            this.color = color
    }
    draw() {//function used to draw the player onto the screen
        ctx.beginPath() //to let the context know we want to start drawing on the screen
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //arc function used to create a circle
        ctx.fillStyle = this.color; //change color of the circle
        ctx.fill() //create the circle on the screen
    }
};


//projectile class
class Projectile {
    constructor(x, y, radius, color, velocity) { //this is the constructor used to create the projectile
        this.x = x,
            this.y = y,
            this.radius = radius,
            this.color = color,
            this.velocity = velocity
    }
    draw() {//function used to draw the projectile onto the screen
        ctx.beginPath() //to let the context know we want to start drawing on the screen
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //arc function used to create a circle
        ctx.fillStyle = this.color; //change color of the circle
        ctx.fill() //create the circle on the screen
    }
    update() {
        this.draw();
        this.x += this.velocity.x,
            this.y += this.velocity.y
    }
}



//enemy class
class Enemy {
    constructor(x, y, radius, color, velocity) { //this is the constructor used to create the projectile
        this.x = x,
            this.y = y,
            this.radius = radius,
            this.color = color,
            this.velocity = velocity
    }
    draw() {//function used to draw the projectile onto the screen
        ctx.beginPath() //to let the context know we want to start drawing on the screen
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //arc function used to create a circle
        ctx.fillStyle = this.color; //change color of the circle
        ctx.fill() //create the circle on the screen
    }
    update() {
        this.draw();
        this.x += this.velocity.x,
            this.y += this.velocity.y
    }
}






const x = canvas.width / 2; //x at center of canvas width
const y = canvas.height / 2; //y at center of canvas height.
const player = new Player(x, y, 10, 'white');
//create the player on screen

// const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1 });
// const projectile2 = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: -1, y: 1 });

const projectiles = []; //array that holds all the projectiles that are made
const enemies = []; //enemies that holds all the projectiles that are made

function spawnEnemies() {
    setInterval(() => {
        const radius = (Math.random() * 30) + 4;


        let x, y;

        //conditional statements used to randomly generate enemy outside of the canvas
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        // const x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        // const y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        const color = 'green'
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const speed = (Math.random() * 2) + 1;
        const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed

        } //trig math used to find the angle at which you clicked and pass on to the below array
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

let animationId;

function animate() { //used to animate
    animationId = requestAnimationFrame(animate); //constantly calls itself I believe
    ctx.fillStyle = 'rgba(0,0,0,0.1';
    ctx.fillRect(0, 0, canvas.width, canvas.height); //clear the canvas by drawing over itself
    player.draw(); //draw the player on screen
    projectiles.forEach((projectile, projectileIndex) => { //for all the projectiles in the array call the update function 
        projectile.update(); //update position of projectile

        //remove when projectiles are no longer on screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => { //remove projectile from the array
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }

    })
    enemies.forEach((enemy, enemyIndex) => { //for all the projectiles in the array call the update function 
        enemy.update(); //update enemy position

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y); //get distance between player and enemy
        if (dist - enemy.radius - player.radius < 1) { //if enemy reaches player cancel animation
            cancelAnimationFrame(animationId); //cancel animation

        }

        projectiles.forEach((projectile, projectileIndex) => { //check where the enemies are
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y); //get distance between projectile and enemy
            // console.log(dist);
            if (dist - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1); //remove enemy
                    projectiles.splice(projectileIndex, 1); //remove projectile
                }, 0);


            }
        })
    })
}

addEventListener('click', (event) => { //event listener added to window
    // console.log(event);
    // console.log(projectiles);
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4

    } //trig math used to find the angle at which you clicked and pass on to the below array
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)); //create a new projectile with the passed on values

});

animate();
spawnEnemies();