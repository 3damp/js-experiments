// -----------------------------------------------
// Experiment made in 2015 as a student.
// 
// Horrible code. Do NOT take as reference.
// -----------------------------------------------

export default class mysc {
    text;

    rnd = 0;
    day = 0;
    espesor = 1;
    iinit;

    bgrdColor = '#eeeeee';
    drawColor = '#000000';

    scale = 1;
    branchProb = 1.5;
    twigLimit = 30;
    twigProb = 0.6;
    groundHeight = 40;

    tree;
    pen = [];

    constructor(seed) {
        this.text = seed || Math.round(Math.random() * 10000);
        this.init();
    }


    createPen(x, y, angle) {
        return {
            x, y, angle: angle || (-Math.PI / 2)
        }
    }

    init() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.w = this.canvas.width;
        this.h = this.canvas.height;

        this.startingX = (0.5 + this.w / 2);
        this.startingY = (this.h * this.scale);

        this.ctx.fillStyle = this.bgrdColor;
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.drawGround();

        this.pen.push(this.createPen(this.startingX, this.startingY));
        this.tree = {
            heightMax: 450,
            espesorMax: 70
        };



        //Random preparation
        // this.rnd = 1234
        // for (let i = 0; i < 1000; i++) {
        //     this.rnd = (this.rnd % 1000) * 1000 + (this.rnd % 1000) + (Math.round(this.rnd / 1000) % 1000);
        // }

    }

    drawGround() {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(0, this.h - this.groundHeight, this.w, this.h);
    }

    growStep = () => {

        this.rnd = parseInt(this.text);
        this.day += 50;

        //CRECIMIENTO
        if (this.day < this.tree.heightMax) {
            this.iinit = this.day;
            for (let i = this.day; i > 0; i--) {

                this.drawTree(i);

            }
            this.drawGround();

        } else { //ENSANCHE
            if (this.espesor < this.tree.espesorMax) {
                this.espesor += 1 - (this.espesor / this.tree.espesorMax);
            }
            this.iinit = this.tree.heightMax;
            for (let i = this.tree.heightMax; i > 0; i--) {

                this.drawTree(i);

            }
            this.drawGround();
        }

        //reset pen
        this.pen = [];
        this.pen[0] = this.createPen(this.startingX, this.startingY);

    }

    changeText() {

        //seed change
        // this.text = document.getElementById("txtfld");
        this.rnd = parseInt(this.text.value);
        for (let i = 0; i < 10; i++) {
            this.rnd = (this.rnd % 100) * 100 + (this.rnd % 100) + (Math.round(this.rnd / 100) % 100);
        }
        this.day = 0;
        this.espesor = 1;
    }
    drawBall(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.drawColor;
        this.ctx.fill();
    }
    drawTree(growthStep) {
        //angle calculation
        this.pen[0].angle += -0.05 + 0.10 * (this.getRnd() / 100);
        if (this.pen[0].angle < -Math.PI / 2) {
            this.pen[0].angle += 0.003;
        } else {
            this.pen[0].angle -= 0.003;
        }
        this.pen[0].x += Math.cos(this.pen[0].angle);
        this.pen[0].y += Math.sin(this.pen[0].angle);
        this.drawBall(this.pen[0].x, this.pen[0].y, growthStep / (80 - this.espesor));


        //generate branch
        if (this.getRnd() < this.branchProb && this.iinit > 100 && this.iinit <= this.tree.heightMax && growthStep < this.iinit - 100) {
            this.pen.push(this.createPen(this.pen[0].x, this.pen[0].y, (-Math.PI + this.getRnd() / 100 * Math.PI)));
        }

        for (let k = 1; k < this.pen.length; k++) {
            //Moving pen
            this.pen[k].x += Math.cos(this.pen[k].angle);
            this.pen[k].y += Math.sin(this.pen[k].angle);
            this.pen[k].angle += -0.1 + 0.20 * (this.getRnd() / 100);


            if (this.pen[k].angle <= -(Math.PI)) {
                this.pen[k].angle += 2 * Math.PI;
            } if (this.pen[k].angle >= Math.PI) {
                this.pen[k].angle -= 2 * Math.PI;
            }

            if (this.pen[k].angle < Math.PI && this.pen[k].angle > Math.PI / 2) {
                this.pen[k].angle += 0.03;
            } if (this.pen[k].angle <= Math.PI / 2 && this.pen[k].angle > 0) {
                this.pen[k].angle -= 0.03;
            }


            //Generate twig
            const rnd1 = this.getRnd();
            //end twigs
            if (rnd1 < 2 && this.pen.length < 200 && this.iinit > this.tree.heightMax - 100 && growthStep < 100 - (this.tree.heightMax - this.iinit) && this.iinit <= this.tree.heightMax) {
                this.pen.push(this.createPen(this.pen[k].x, this.pen[k].y, (this.getRnd() / 100) * 2 * Math.PI));
            }//middle twigs
            else if (rnd1 < this.twigProb && this.pen.length < this.twigLimit) {
                this.pen.push(this.createPen(this.pen[k].x, this.pen[k].y, this.pen[k].angle - (Math.PI - 2) + (this.getRnd() / 100 * (Math.PI - 1))));
            }

            this.drawBall(this.pen[k].x, this.pen[k].y, growthStep / (100 - this.espesor));
        }

    }

    getRnd() {
        this.rnd = (this.rnd % 1000) * 1000 + ((this.rnd % 1000) + (Math.round(this.rnd / 1000) % 1000) + 1234);
        return (this.rnd % 1000) / 10;
    }



}
