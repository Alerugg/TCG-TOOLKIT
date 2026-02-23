export default function PinnedCommentBox({ text }: { text: string }) {
  return (
    <div className="pinned-box">
      <strong>Comentario fijado:</strong>
      <p>{text}</p>
    </div>
  );
}