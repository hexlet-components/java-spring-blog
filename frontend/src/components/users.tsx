import {
  Datagrid,
  DateField,
  List,
  TextField,
} from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);
