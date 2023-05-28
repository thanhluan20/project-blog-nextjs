import commentService from "@/services/comment";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { useGlobalState } from "@/state";
import { useMemo, useState } from "react";
import styles from "./comments.module.css";

export default function PostDetailComments({PostDetails}: any) {
  const [postIdDetail] = useGlobalState("postIdDetail");
  const [commentLoading, setCommentLoading] = useState(false);
  const [{ comments, currentPage, exclude, totalComment }, setCommentsPaging] = useGlobalState("commentsPaging");
  
  const remainComment = totalComment - comments.length;

  function handleLoadMore(evt: any) {
    evt.preventDefault();
    const responseCommentsParent = commentService.getList({ page: currentPage + 1, per_page: 5, post: postIdDetail, parent: 0, exclude: [] });
    console.log("responseCommentsParent", responseCommentsParent)
    return {...responseCommentsParent};

  }

  return (
    <div className={styles["post-detail__comments"]}>
          <CommentForm parentId={0}/>
          <p>{Comments.total} Comments</p>
            
          {Comments.CommentsData && Comments.CommentsData.length > 0 && (
            <ul className={styles["comments"]}>
              {Comments.CommentsData.map((comment: any) => (
                <CommentItem key={comment.id} comment={comment}/>
              ))}
            </ul>
          )}
          
          {restTotal > 0 && (
            <div className={styles["comments__hidden"] + " " + styles["parent"]}>
              <a href="/" onClick={handleLoadMore}>
                <i className={styles["icons"] + " ion-ios-undo"} /> Xem thêm {restTotal} câu trả lời
              </a>
            </div>
          )}
       
        </div>
  );
}