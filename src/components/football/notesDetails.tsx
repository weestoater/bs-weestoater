interface NotesDetailsProps {
  notes?: string;
}

export const NotesDetails = (props: NotesDetailsProps) => {
  const notes = props.notes ? props.notes : null;
  return (
    <div className="mt-3 pt-3 border-top">
      <p className="fw-bold mb-2">Notes:</p>
      <p className="mb-0">{notes}</p>
    </div>
  );
};
