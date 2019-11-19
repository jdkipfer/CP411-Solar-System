
import {Sphere,Vector3, Mesh, SphereGeometry, MeshBasicMaterial, Object3D, Material, Texture, MeshPhongMaterial} from 'three'
export class Planet  extends Object3D{
    private mesh : Mesh
    private moons : Planet[] = []
    constructor(
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
            this.mesh.translateX(orbitRadius);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.castShadow = true;
            this.receiveShadow = true;
            this.rotateX(apogee)
            this.add(this.mesh)
    }


    public addMoon(moon : Planet) {
        this.mesh.add(moon)
        this.moons.push(moon)
    }


    public tick() {
        this.rotation.y += this.orbitalVelocity
        this.mesh.rotation.y += this.spinVelocity
        this.moons.forEach(m => m.tick())
    }
}

