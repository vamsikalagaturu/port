/*
A component of a Wheeled Mobile Manipulator (WMM) that consists of a robot base and a manipulator arm.
*/
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

const calculateInverseKinematics = (x: number, y: number, armLengths: number[]) => {
  const [l1, l2, l3] = armLengths;
  // compute the angle theta1
  const theta1 = Math.atan2(y, x);
  // compute the angle theta3
  const r = Math.sqrt(x * x + y * y);
  const a = r - l3;
  const b = Math.sqrt(a * a + l2 * l2);
  const c = Math.sqrt(l1 * l1 + b * b);
  // use atan2
  const theta3 = Math.acos((l1 * l1 + b * b - c * c) / (2 * l1 * b));
  // compute the angle theta2
  const alpha = Math.atan2(a, l2);
  const beta = Math.acos((l1 * l1 + c * c - b * b) / (2 * l1 * c));
  const theta2 = alpha + beta;
  return [theta1, theta2, theta3];
};

// Custom hook to manage base position
export const useBasePosition = (
  baseWidth: number,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [basePosition, setBasePosition] = useState({ x: 0, y: 0 });

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickedX = event.clientX - rect.left;
      const newBaseX = Math.min(Math.max(clickedX - baseWidth / 2, 0), canvas.width - baseWidth);
      setBasePosition((prev) => ({ ...prev, x: newBaseX }));
    },
    [canvasRef, baseWidth]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("click", handleCanvasClick);
    return () => canvas.removeEventListener("click", handleCanvasClick);
  }, [canvasRef, handleCanvasClick]);

  return { basePosition, setBasePosition };
};

// canvas component
const WMMCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseWidth = 100;
  const baseHeight = 40;
  const wheelRadius = 10;
  const armLengths = useMemo(() => [60, 80, 60], []);
  const armThetas = useMemo(() => [Math.PI / 2, 0, -Math.PI / 2], []);
  const groundHeight = 40;

  const { basePosition, setBasePosition } = useBasePosition(baseWidth, canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas dimensions and drawing logic
    canvas.width = (canvas.parentElement?.clientWidth ?? 0) * 0.8;
    canvas.height = 300;

    ctx.fillStyle = "#ebe4d6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height - groundHeight);
    ctx.lineTo(canvas.width, canvas.height - groundHeight);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    const baseStartX = (canvas.width - baseWidth) / 2;
    const baseY = canvas.height - groundHeight - baseHeight - wheelRadius;

    if (basePosition.x === 0 && basePosition.y === 0) {
      setBasePosition({ x: baseStartX, y: baseY });
    }

    // Drawing base
    drawBase(
      ctx,
      basePosition.x,
      basePosition.y,
      baseWidth,
      baseHeight,
      wheelRadius,
      canvas.height,
      groundHeight
    );

    // Drawing arm
    drawArm(ctx, basePosition.x, basePosition.y, armLengths, armThetas, baseWidth);
  }, [
    basePosition,
    armThetas,
    groundHeight,
    baseWidth,
    baseHeight,
    wheelRadius,
    armLengths,
    setBasePosition,
  ]);

  return (
    <div className="flex justify-center w-full">
      <canvas ref={canvasRef} className="border border-gray-300" />
    </div>
  );
};

const drawBase = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  baseWidth: number,
  baseHeight: number,
  wheelRadius: number,
  canvasHeight: number,
  groundHeight: number
) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(baseX, baseY, baseWidth, baseHeight);
  ctx.strokeRect(baseX, baseY, baseWidth, baseHeight);

  // Draw the wheels
  ctx.beginPath();
  ctx.arc(
    baseX + wheelRadius,
    canvasHeight - groundHeight - wheelRadius,
    wheelRadius,
    0,
    2 * Math.PI
  );
  ctx.arc(
    baseX + baseWidth - wheelRadius,
    canvasHeight - groundHeight - wheelRadius,
    wheelRadius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#928f8e";
  ctx.fill();
};

const drawArm = (
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  armLengths: number[],
  armThetas: number[],
  baseWidth: number
) => {
  const [armTheta1, armTheta2, armTheta3] = armThetas;

  const armLink1StartX = baseX + baseWidth / 1.25;
  const armLink1StartY = baseY;

  const armLink1EndX = armLink1StartX + armLengths[0] * Math.cos(armTheta1);
  const armLink1EndY = armLink1StartY - armLengths[0] * Math.sin(armTheta1);

  // Draw the first arm link
  ctx.beginPath();
  ctx.moveTo(armLink1StartX, armLink1StartY);
  ctx.lineTo(armLink1EndX, armLink1EndY);
  ctx.strokeStyle = "#f00";
  ctx.stroke();

  const armLink2StartX = armLink1EndX;
  const armLink2StartY = armLink1EndY;

  const armLink2EndX = armLink2StartX + armLengths[1] * Math.cos(armTheta2);
  const armLink2EndY = armLink2StartY - armLengths[1] * Math.sin(armTheta2);

  // Draw the second arm link
  ctx.beginPath();
  ctx.moveTo(armLink2StartX, armLink2StartY);
  ctx.lineTo(armLink2EndX, armLink2EndY);
  ctx.strokeStyle = "#0f0";
  ctx.stroke();

  const armLink3StartX = armLink2EndX;
  const armLink3StartY = armLink2EndY;

  const armLink3EndX = armLink3StartX + armLengths[2] * Math.cos(armTheta3);
  const armLink3EndY = armLink3StartY - armLengths[2] * Math.sin(armTheta3);

  // Draw the third arm link
  ctx.beginPath();
  ctx.moveTo(armLink3StartX, armLink3StartY);
  ctx.lineTo(armLink3EndX, armLink3EndY);
  ctx.strokeStyle = "#f00";
  ctx.stroke();

  // draw the gripper
  const gripperWidth = 30;
  drawGripper(ctx, armLink3EndX, armLink3EndY, armTheta3, gripperWidth);
};

const drawGripper = (
  ctx: CanvasRenderingContext2D,
  armLink3EndX: number,
  armLink3EndY: number,
  armTheta3: number,
  gripperWidth: number
) => {
  const gripperCenterX = armLink3EndX;
  const gripperCenterY = armLink3EndY;

  const gripperFinger1StartX =
    gripperCenterX - (gripperWidth / 2) * Math.cos(armTheta3 - Math.PI / 2);
  const gripperFinger1StartY =
    gripperCenterY - (gripperWidth / 2) * Math.sin(armTheta3 - Math.PI / 2);
  const gripperFinger1EndX = gripperCenterX;
  const gripperFinger1EndY = gripperCenterY;

  const gripperFinger2StartX = gripperCenterX;
  const gripperFinger2StartY = gripperCenterY;
  const gripperFinger2EndX =
    gripperCenterX + (gripperWidth / 2) * Math.cos(armTheta3 - Math.PI / 2);
  const gripperFinger2EndY =
    gripperCenterY + (gripperWidth / 2) * Math.sin(armTheta3 - Math.PI / 2);

  ctx.beginPath();
  ctx.moveTo(gripperFinger1StartX, gripperFinger1StartY);
  ctx.lineTo(gripperFinger1EndX, gripperFinger1EndY);
  ctx.strokeStyle = "#e0f";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(gripperFinger2StartX, gripperFinger2StartY);
  ctx.lineTo(gripperFinger2EndX, gripperFinger2EndY);
  ctx.strokeStyle = "#00f";
  ctx.stroke();
};

export default WMMCanvas;
