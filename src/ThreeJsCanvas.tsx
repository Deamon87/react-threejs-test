import React, {MouseEventHandler, useEffect, useRef} from 'react'
import * as THREE from "three";
import ThreeJsComponent from "./threejsClass";

interface CanvasProps {
    width : string;
    height : string;
    threeJsApp : ThreeJsComponent | null;
    onClick : MouseEventHandler;
}

const Canvas = (props : CanvasProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)



    useEffect(() => {

        if (canvasRef.current) {
            props.threeJsApp?.init(canvasRef.current, parseInt(props.width), parseInt(props.height));
        }

    }, [])

    return <canvas onClick={props.onClick} ref={canvasRef} width={props.width} height={props.height}/>
}

export default Canvas;