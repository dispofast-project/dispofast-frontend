import { Box } from "@mui/material"
import Dropdown from "../../../../shared/components/Dropdown/Dropdown"
import { Input } from "../../../../shared/components/Input/Input"

const OrdersCreationForm = () => {
    return (
        <Box>
            <Dropdown 
                label="Cliente" 
                options={[]}
                value=""
                onChange={() => {}}
                placeholder="Seleccione un cliente"
            />
            <Input label="Asesor Comercial" disabled={true} readOnly={true} />
            <Dropdown 
                label="Cliente" 
                options={[]}
                value=""
                onChange={() => {}}
                placeholder="Seleccione un cliente"
            />
            <Dropdown 
                label="Cliente" 
                options={[]}
                value=""
                onChange={() => {}}
                placeholder="Seleccione un cliente"
            />
        </Box>
    )    
}