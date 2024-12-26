type WhiteBoardProps = {
  ctxRef: React.RefObject<HTMLCanvasElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export const WhiteBoard: React.FC<WhiteBoardProps> = ({
  ctxRef,
  canvasRef,
}) => {
  return <canvas ref={canvasRef}></canvas>
}
