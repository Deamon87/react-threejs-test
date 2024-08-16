import * as THREE from "three";

class ThreeJsComponent {
    renderer : THREE.WebGLRenderer | null = null;
    camera : THREE.PerspectiveCamera | null = null;
    scene : THREE.Scene | null = null;
    cube : THREE.Mesh | null = null;

    canvas : HTMLCanvasElement | null = null;

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    lastClickedColor = "";

    _width : number = 0;
    _height: number = 0;

    randomColors : Array<number> = [];

    constructor() {
        for (let i = 0; i < 36; i++) {
            this.randomColors.push(Math.floor(0xffffff) * Math.random());
        }
    }
    createCube() : THREE.Mesh {
        const piece = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true
        });
        const positionAttribute = piece.getAttribute('position');
        const colors = [];

        const color = new THREE.Color();

        let face = 0;
        for (let i = 0; i < positionAttribute.count; i += 6) {

            color.setHex(this.randomColors[face++]);

            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);

            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
        } // for

        // define the new attribute
        piece.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const cube = new THREE.Mesh(piece, material);

        return cube;
    }

    init(canvas : HTMLCanvasElement, width : number, height: number){
        this._width = width;
        this._height = height;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.camera.position.y = 2;
        this.camera.position.z = 5;
        this.camera.lookAt(0,0,0);

        const onPointerMove = ( event : MouseEvent ) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            this.pointer.x = ( event.clientX / canvas.width ) * 2 - 1;
            this.pointer.y = - ( event.clientY / canvas.height ) * 2 + 1;
        }

        window.addEventListener( 'pointermove', onPointerMove );


        this.scene = new THREE.Scene();

        this.cube = this.createCube();
        this.scene.add( this.cube );


        const render = (t: number): void => {
            if (!this.renderer || !this.camera || !this.scene) return;

            this.renderer.render(this.scene, this.camera);

            requestAnimationFrame(render);
        }

        render(0);
    }

    setRotation(rot : number) {
        if (!this.cube) return;

        this.cube.rotation.y = rot;
    }

    makeTwoDigits(s : string) {
        return s.length > 2 ? s : "0".repeat(2 - s.length) + s
    }

    handleClick() : string | null {
        if (!this.renderer || !this.camera || !this.scene) return null;

        this.raycaster.setFromCamera( this.pointer, this.camera );

        const intersects = this.raycaster.intersectObjects( this.scene.children );

        for ( let i = 0; i < intersects.length; i ++ ) {
            if (intersects[ i ].object == this.cube) {

                const ndcPoint =  intersects[ i ].point.project(this.camera);

                const pixelCoords = [
                    ((ndcPoint.x + 1.0) / 2.0) * this._width,
                    ((ndcPoint.y + 1.0) / 2.0) * this._height];

                const rt = new THREE.WebGLRenderTarget(this._width, this._height);
                this.renderer.setRenderTarget(rt);
                this.renderer.render(this.scene, this.camera);
                this.renderer.setRenderTarget(null);

                var pb = new Uint8Array(4);
                this.renderer.readRenderTargetPixels(rt, pixelCoords[0], pixelCoords[1], 1, 1, pb);

                this.lastClickedColor = "#" +
                    this.makeTwoDigits(pb[0].toString(16)) +
                    this.makeTwoDigits(pb[1].toString(16)) +
                    this.makeTwoDigits(pb[2].toString(16));

                return this.lastClickedColor;
            }
        }
        return null;
    }
}

export default ThreeJsComponent;