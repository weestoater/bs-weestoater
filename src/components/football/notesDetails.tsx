export const NotesDetails = (props: any) => {
  const notes = props.notes ? props.notes : null;
  return (
    <>
      <hr />
      <p>
        <strong>Notes:</strong>
      </p>
      <p>{notes}</p>
    </>
  );
};
