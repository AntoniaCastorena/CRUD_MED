import { Server } from 'azle';
import { id } from 'azle/src/lib/ic/id';
import express, { Request } from 'express';
import { Canister, query, update, bool } from 'azle';

let idIN =0;
    
type Datos = {
    nombre: string,
    edad:number,
    domicilio: string,
    fechaNacimiento: string,
    CURP:string,
    contactoFamiliar: number,
    
    seguro: string,
    noSeguro:number,
    diagnostico: string,
    noExpediente:number,
    expediente: string,
    fechaRegistro: string
}


let pacientes: Datos[] = [{
    nombre: "John",
    edad:10,
    domicilio: "",
    fechaNacimiento: "2024-12-12",
    CURP:"OICA030907MASRSSA06",
    contactoFamiliar: 1111111111,
    seguro: "IMGSS",
    noSeguro:123456789,
    diagnostico: "Gripe",
    noExpediente: 123456789,
    expediente: "123456789",
    fechaRegistro: "2024-12-12"
}];

export default Server(() => {
    const app = express();
    app.use(express.json());

    app.get("/pacientes", (req, res) => {
        res.json(pacientes);
    });

    app.post("/pacientes", (req, res) => {
        const paciente=req.body;
        const registro = pacientes.find(Datos => Datos.noExpediente == paciente.noExpediente)
        if(!registro)
        {
            pacientes = [...pacientes, req.body]
            res.send("Paciente registrado con exito");
        }else{
            res.status(404).send("El expediente ya existe");
            return; 
        }
        
    });;

    app.get("/pacientes/:noExpediente", (req, res) => {
        try 
        {
            const noExpediente = parseInt(req.params.noExpediente);
            const registro = pacientes.find(Datos => Datos.noExpediente == noExpediente)
          if(!registro)
          {
            res.status (404).send("Paciente no encontrado");
          }
            res.json(registro);
        } 
        catch (error) 
        {
          res.status(500);
        }
    });
    


    app.put("/pacientes/:noExpediente", (req, res) => {
        const noExpediente = parseInt(req.params.noExpediente);
        const registro = pacientes.find(Datos => Datos.noExpediente == noExpediente)

        if (!registro) {
            
            res.status(404).send("Expediente no encontrado");
            return;
        }else{
            const updatePas = { ...registro, ...req.body };
        
            pacientes = pacientes.map((b) => b.noExpediente === updatePas.noExpediente ? updatePas : b);
            res.send("Datos actualizados correctamente");
        }

    });

    app.delete("/pacientes/:noExpediente", (req, res) => {
        const noExpediente = parseInt(req.params.noExpediente);
        pacientes = pacientes.filter((registro) => registro.noExpediente == noExpediente);

        if (!pacientes) {
            
            res.status(404).send("Error al eliminar el expediente");
            return;
        }else{
            res.send("Paciente eliminado");
        }
    });

    app.use(express.static('/dist'));

    return app.listen();
});
