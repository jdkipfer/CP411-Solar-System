
import {Sphere,Vector3, Mesh, SphereGeometry, MeshBasicMaterial, Object3D, Material, Texture, MeshPhongMaterial} from 'three'
export class Planet  extends Object3D{

    private mesh : Mesh
    private pivot : Object3D
    constructor(
        private orbitRadius : number,
        private planetRadius: number,
        private orbitalVelocity: number,
        private spinVelocity: number,
        private pivotPoint: Vector3,
        texture: Texture,
        phong: boolean){
            super();
            if(phong){
                this.mesh = new Mesh(new SphereGeometry( planetRadius, 32, 32 ),new MeshPhongMaterial({map:texture}))
            } else {
                this.mesh = new Mesh(new SphereGeometry( planetRadius, 32, 32 ),new MeshBasicMaterial({map:texture}))
                
            }
            this.translateX(this.pivotPoint.x);
            this.translateY(this.pivotPoint.y);
            this.translateZ(this.pivotPoint.z);
            this.mesh.translateX(orbitRadius);
            this.add(this.mesh)
    }


    public tick() {
        this.rotation.y += this.orbitalVelocity
        this.mesh.rotation.y += this.spinVelocity
    }
}

