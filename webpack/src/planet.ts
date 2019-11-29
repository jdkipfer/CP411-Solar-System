
import {Sphere,Vector3, Mesh, SphereGeometry, MeshBasicMaterial, Object3D, Material, Texture, MeshPhongMaterial, RingGeometry, DoubleSide} from 'three'
export class Planet  extends Object3D{
    public mesh : Mesh
    private moons : Planet[] = []
    private planetPoint : Object3D
    private ring : Object3D
    private mainPoint: Object3D
    constructor(
        public planetName: string,
        public wikiTitle : string,
        private orbitRadius : number,
        private planetRadius: number,
        private apogee: number,
        private orbitalVelocity: number,
        private spinVelocity: number,
        private pivotPoint: Vector3,
        public material: Material,
        private displayRing: boolean = true){
            super();
            this.mainPoint = new Object3D()
            this.mainPoint.castShadow = true;
            this.mainPoint.receiveShadow = true;
            this.add(this.mainPoint)
            this.mesh = new Mesh(new SphereGeometry( planetRadius, 32, 32 ),material)
            this.translateX(this.pivotPoint.x);
            this.translateY(this.pivotPoint.y);
            this.translateZ(this.pivotPoint.z);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.name = wikiTitle;
            this.castShadow = true;
            this.receiveShadow = true;
            this.rotateX(apogee)
            this.planetPoint = new Object3D();
            this.planetPoint.translateX(orbitRadius);
            this.planetPoint.castShadow = true;
            this.planetPoint.receiveShadow = true;
            this.planetPoint.add(this.mesh)
            this.mainPoint.add(this.planetPoint)
            const geometry = new RingGeometry( orbitRadius-.01, orbitRadius, 100);
            const ringMaterial = new MeshBasicMaterial( { color: 0xffffff, side: DoubleSide } );
            this.ring = new Mesh( geometry, ringMaterial );
            this.ring.rotation.x = Math.PI /2;
            if(displayRing)this.add(this.ring);
    }


    public addMoon(moon : Planet) {
        this.planetPoint.add(moon)
        this.moons.push(moon)
    }


    public tick(delay : number) {
        this.mainPoint.rotation.y += this.orbitalVelocity*delay
        this.mesh.rotation.y += this.spinVelocity*delay
        this.moons.forEach(m => m.tick(delay))
    }

    public toggleRing(value: boolean) {
        this.ring.visible = value
        this.moons.forEach(m => m.toggleRing(value))
    }
}

