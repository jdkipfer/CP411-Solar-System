
import {Sphere,Vector3, Mesh, SphereGeometry, MeshBasicMaterial, Object3D, Material, Texture, MeshPhongMaterial} from 'three'
export class Planet  extends Object3D{
    public mesh : Mesh
    private moons : Planet[] = []
    private planetPoint : Object3D
    constructor(
        public planetName: string,
        public wikiTitle : string,
        private orbitRadius : number,
        private planetRadius: number,
        private apogee: number,
        private orbitalVelocity: number,
        private spinVelocity: number,
        private pivotPoint: Vector3,
        public material: Material){
            super();
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
            this.add(this.planetPoint)
    }


    public addMoon(moon : Planet) {
        this.planetPoint.add(moon)
        this.moons.push(moon)
    }


    public tick(delay : number) {
        this.rotation.y += this.orbitalVelocity*delay
        this.mesh.rotation.y += this.spinVelocity*delay
        this.moons.forEach(m => m.tick(delay))
    }
}

