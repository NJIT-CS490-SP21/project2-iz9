import React from 'react';
import './Main.css';

export function ListItem(props){
    return <tr>
    {props.name}
    </tr>;
}