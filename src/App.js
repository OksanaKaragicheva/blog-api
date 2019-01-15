import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

      this.state = {
        posts: [],
        comments: [],
        newComment: "",
        showAllPosts: true,
        showPostID: 0
      };
  }

componentDidMount() {
  let url = "http://localhost:3001/posts";
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
         this.setState({
           posts: data
         });
      });
}

showPost = (id) => {
  this.setState({
    showPostID: id,
    showAllPosts: false
  });
    let url1 = "http://localhost:3001/comments";
      fetch(url1)
       .then(resp => resp.json())
       .then(data => {
          this.setState({
            comments: data
          });
       });
}

inputComment = (e) => {
   this.setState({
     newComment: e.target.value
   });
}

addNewComment = (comment) => {
  let commentsUrl = "http://localhost:3001/comments";
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    }
      return fetch(commentsUrl, options)
        .then((response) => response.json)
        .then(data => {
           this.setState({
             comments: [...this.state.comments, comment],
             newComment: ""
           });
        });
}

closePost = () => {
  this.setState({
    showAllPosts: true
  });
}

  render() {

    const currentComments = this.state.comments.filter((comment, index) => {
      return comment.postId === this.state.showPostID;
    });

    return (
      <div>
        {
          this.state.showAllPosts ? this.state.posts.map((post, index) => {
          return (
            <div key={index}>
              <h3 className="post-title" onClick={() => this.showPost(post.id)}>{post.title}</h3>
            </div>
          )
        })
        :
        this.state.posts.map((post, index) => {
          return (
           <div key={index}>
             {
               post.id === this.state.showPostID ? <div><h3 className="post-title" onClick={this.closePost}>{post.title}</h3>
               <p className="post-body">{post.body}</p>
               {
                 currentComments.map((comment, index) => {return <div key={index} className="comments"><p>{comment.body}{comment.time}</p></div>})
               }
               </div>
               :
               null
             }
           </div>
          )
        })
        }
          {
            !this.state.showAllPosts ? <div><input type="text" placeholder="Input the comment..." value={this.state.newComment} onChange={this.inputComment}/>
            <button type="submit" value="Submit" onClick={() => this.addNewComment({"body": this.state.newComment, "postId": this.state.showPostID})}>Add Comment</button></div> : null
          }
      </div>
    );
  }
}

export default App;
