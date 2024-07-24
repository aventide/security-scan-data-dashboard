import { Link } from "wouter";

export default function Header(){
    return <div style={{display: 'flex', justifyContent: "center"}}>
        <Link to="/devices" style={{marginInline: '10px'}}>Devices</Link>
        |
        <Link to="/events" style={{marginInline: '10px'}}>Events</Link>
        |
        <Link to="/metrics" style={{marginInline: '10px'}}>Metrics</Link>
    </div>
}