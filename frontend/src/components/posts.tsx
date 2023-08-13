import {
  Create,
  Datagrid,
  DateField,
  Edit,
  List,
  ReferenceField,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      {/* <ReferenceInput source="userId" reference="users" /> */}
      <TextInput source="name" />
      <TextInput source="slug" />
      <TextInput source="body" multiline rows={5} />
    </SimpleForm>
  </Create>
);

export const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="slug" />
      <TextInput source="name" />
      <TextInput source="body" multiline rows={5} />
    </SimpleForm>
  </Edit>
);

export const PostList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="authorId" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <TextField source="slug" />
      <TextField source="name" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="authorId" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <TextField source="slug" />
      <TextField source="name" />
      <TextField source="body" />
      <DateField source="createdAt" showTime />
    </SimpleShowLayout>
  </Show>
);
