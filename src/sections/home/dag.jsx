/* eslint-disable no-plusplus */
import p5 from 'p5';
import React, { useEffect } from 'react';

const GraphSimulation3D = () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const nodes = [];

    useEffect(() => {
        const sketch = (p) => {
            let angleX = 0;
            let angleY = 0;

            p.setup = () => {
                p.createCanvas(600, 400, p.WEBGL);
                for (let i = 0; i < 5; i++) {
                    nodes.push({
                        position: p.createVector(p.random(-100, 100), p.random(-100, 100), p.random(-100, 100)),
                        radius: 20,
                    });
                }
            };

            p.draw = () => {
                p.background(255);
                p.rotateX(angleX);
                p.rotateY(angleY);

                p.stroke(0);
                p.strokeWeight(2);
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = 0; j < nodes.length; j++) {
                        if (i !== j) {
                            p.line(
                                nodes[i].position.x,
                                nodes[i].position.y,
                                nodes[i].position.z,
                                nodes[j].position.x,
                                nodes[j].position.y,
                                nodes[j].position.z
                            );
                        }
                    }
                }
                p.noStroke();
                for (let i = 0; i < nodes.length; i++) {
                    p.fill(100, 0, 0);
                    p.push();
                    p.translate(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
                    p.sphere(nodes[i].radius);
                    p.pop();
                }

                angleX += 0.01;
                angleY += 0.01;
            };
        };

        // eslint-disable-next-line new-cap
        const sketchInstance = new p5(sketch);

        return () => {
            sketchInstance.remove();
        };
    }, [nodes]);

    return <div id="graph-container" />
};

export default GraphSimulation3D;
