        const rules = {
          X: [
            { rule: "(F[+X][-X]FX)",  prob: 0.5  },
            { rule: "(F[-X]FX)",      prob: 0.05 },
            { rule: "(F[+X]FX)",      prob: 0.05 },
            { rule: "(F[++X][-X]FX)", prob: 0.1  },
            { rule: "(F[+X][--X]FX)", prob: 0.1  },
            { rule: "(F[+X][-X]FXA)",  prob: 0.1  },
            { rule: "(F[+X][-X]FXB)",  prob: 0.1  }
          ],
          F: [
            { rule: "F(F)",  prob: 0.85 },
            { rule: "F(FF)", prob: 0.05 },
            { rule: "F",   prob: 0.1 },
          ],
          "(": "",
          ")": ""
        };

        let len, ang;
        let drawRules;

        let word = "X";

        const maxGeneration = 6;
        let currGeneration = 0;

        let growthPercent = 1;
        const growthRate = 0.04;

        function setup() {
          // Create a canvas that scales with the window size
          createCanvas(windowWidth, windowHeight);
          strokeWeight(2);

          // Initialize parameters based on the window size
          len = windowWidth / 100; // Line length scales with window size
          ang = 25; // You can scale the angle too, or keep it fixed

          drawRules = {
            "A": (t) => {
              noStroke();
              fill("#E5CEDC");
              circle(0, 0, len * 2 * t);
            },
            "B": (t) => {
              noStroke();
              fill("#FCA17D");
              circle(0, 0, len * 2 * t);
            },
            "F": (t) => {
              stroke("#9ea93f");
              line(0, 0, 0, -len * t);
              translate(0, -len * t);
            },
            "+": (t) => {
              rotate(PI / 180 * -ang * t);
            },
            "-": (t) => {
              rotate(PI / 180 * ang * t);
            },
            "[": push,
            "]": pop,
          };
        }

        function draw() {
          background('#61E786');

          if (growthPercent < 1) {
            const mod = (currGeneration + growthPercent);
            growthPercent += growthRate / mod;
          } else {
            nextGeneration();
          }

          // Adjust the starting position based on the canvas size
          drawLsysLerp(width / 2, height * 0.9, word, growthPercent);
        }

        function mouseReleased() {
          nextGeneration();
        }

        function nextGeneration() {
          if (growthPercent < 1) {
            return;
          }

          if (currGeneration === maxGeneration) {
            currGeneration = 0;
            word = "X";
          }

          word = generate(word);

          currGeneration++;
          growthPercent = 0;
        }

        function generate(word) {
          let next = "";

          for (let i = 0; i < word.length; i++) {
            let c = word[i];
            if (c in rules) {
              let rule = rules[c];
              if (Array.isArray(rule)) {
                next += chooseOne(rule);
              } else {
                next += rules[c];
              }
            } else {
              next += c;
            }
          }

          return next;
        }

        function chooseOne(ruleSet) {
          let n = random();
          let t = 0;
          for (let i = 0; i < ruleSet.length; i++) {
            t += ruleSet[i].prob;
            if (t > n) {
              return ruleSet[i].rule;
            }
          }
          return "";
        }

        function drawLsysLerp(x, y, state, t) {
          t = constrain(t, 0, 1);

          let lerpOn = false;

          push();
          translate(x, y);
          for (let i = 0; i < state.length; i++) {
            let c = state[i];

            if (c === "(") {
              lerpOn = true;
              continue;
            }

            if (c === ")") {
              lerpOn = false;
              continue;
            }

            let lerpT = t;

            if (!lerpOn) {
              lerpT = 1;
            }

            if (c in drawRules) {
              drawRules[c](lerpT);
            }
          }
          pop();
        }

        // Resize the canvas whenever the window size changes
        function windowResized() {
          resizeCanvas(windowWidth, windowHeight);
          len = windowWidth / 100; // Adjust line length when resizing
        }
    