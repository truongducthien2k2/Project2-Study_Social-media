  import { Injectable } from '@angular/core';
  import { AngularFirestore } from '@angular/fire/firestore';
  import { Comment, Post, User } from '../../interface';
  import { Observable, combineLatest } from 'rxjs';
  import { defaultIfEmpty, map, switchMap } from 'rxjs/operators';
  import firebase from 'firebase/app'; // Sửa lỗi import
  import 'firebase/firestore';
  @Injectable({
    providedIn: 'root',
  })
  export class PostsService {
    constructor(private afs: AngularFirestore) {}

    savePost(data: Post, categoryId?: string): Promise<any> {
      const body = data.body;
      const segments = body.split(/\s+/);
      const tags: string[] = [];
      const bodyWithoutTags: string[] = [];
    
      segments.forEach((segment) => {
        if (this.isTag(segment)) {
          tags.push(segment.substring(1));
        } else {
          bodyWithoutTags.push(segment);
        }
      });
    
      data.tags = tags;
      data.body = bodyWithoutTags.join(' ');
    
      if (categoryId) {
        data.type = categoryId;
      }
    
      return this.afs.collection<Post>('posts').add(data);
    }
    

    private isTag(segment: string): boolean {
      return segment.startsWith('#');
    }

    getPost(id: string) {
      return combineLatest([
        this.afs
          .collection<Post>('posts')
          .doc(id)
          .valueChanges({ idField: 'postId' }),
        this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
        this.getCommentsByPostId(id),
      ]).pipe(
        map(([post, users, comments]) => {
          const user = users.find((u) => u.userId === post?.userId);
          const commentCount = comments.length;
          return { ...post, user, commentCount };
        })
      );
    }

    getPosts(id: string = ''): Observable<Post[]> {
      if (id) {
        return combineLatest([
          this.afs
            .collection<Post>('posts', (ref) => ref.where('userId', '==', id))
            .valueChanges({ idField: 'postId' }),
          this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
        ]).pipe(
          switchMap(([posts, users]) => {
            const postObservables = posts.map((post) => {
              const user = users.find((u) => u.userId === post.userId);
              const comments$ = this.getCommentsByPostId(post.postId);

              return comments$.pipe(
                map((comments) => {
                  const commentCount = comments.length;
                  return { ...post, user, commentCount };
                })
              );
            });
            return combineLatest(postObservables).pipe(
              defaultIfEmpty() // Return an empty array if there are no posts available
            );
          })
        );
      } else {
        return combineLatest([
          this.afs.collection<Post>('posts').valueChanges({ idField: 'postId' }),
          this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
        ]).pipe(
          switchMap(([posts, users]) => {
            const postObservables = posts.map((post) => {
              const user = users.find((u) => u.userId === post.userId);
              const comments$ = this.getCommentsByPostId(post.postId);

              return comments$.pipe(
                map((comments) => {
                  const commentCount = comments.length;
                  return { ...post, user, commentCount };
                })
              );
            });
            return combineLatest(postObservables).pipe(
              defaultIfEmpty() // Return an empty array if there are no posts available
            );
          })
        );
      }
    }

    getPostsbyday(id: string = ''): Observable<Post[]> {
      if (id) {
        return combineLatest([
          this.afs
            .collection<Post>('posts', (ref) => ref.where('userId', '==', id).orderBy('createdAt', 'desc'))
            .valueChanges({ idField: 'postId' }),
          this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
        ]).pipe(
          switchMap(([posts, users]) => {
            const postObservables = posts.map((post) => {
              const user = users.find((u) => u.userId === post.userId);
              const comments$ = this.getCommentsByPostId(post.postId);
    
              return comments$.pipe(
                map((comments) => {
                  const commentCount = comments.length;
                  return { ...post, user, commentCount };
                })
              );
            });
            return combineLatest(postObservables).pipe(
              defaultIfEmpty()
            );
          })
        );
      } else {
        return combineLatest([
          this.afs.collection<Post>('posts', (ref) => ref.orderBy('createdAt', 'desc')).valueChanges({ idField: 'postId' }),
          this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
        ]).pipe(
          switchMap(([posts, users]) => {
            const postObservables = posts.map((post) => {
              const user = users.find((u) => u.userId === post.userId);
              const comments$ = this.getCommentsByPostId(post.postId);
    
              return comments$.pipe(
                map((comments) => {
                  const commentCount = comments.length;
                  return { ...post, user, commentCount };
                })
              );
            });
            return combineLatest(postObservables).pipe(
              defaultIfEmpty() // Return an empty array if there are no posts available
            );
          })
        );
      }
    }
    getPostsByType(type: string): Observable<Post[]> {
      return combineLatest([
        this.afs.collection<Post>('posts', ref => ref.where('type', '==', type).orderBy('createdAt', 'desc')).valueChanges({ idField: 'postId' }),
        this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
      ]).pipe(
        switchMap(([posts, users]) => {
          const postObservables = posts.map(post => {
            const user = users.find(u => u.userId === post.userId);
            const comments$ = this.getCommentsByPostId(post.postId);

            return comments$.pipe(
              map(comments => {
                const commentCount = comments.length;
                return { ...post, user, commentCount };
              })
            );
          });
          return combineLatest(postObservables).pipe(
            defaultIfEmpty([] as Post[]) // Return an empty array if there are no posts available
          );
        })
      );
    }
    deletePost(postID: string): Promise<void> {
      return this.afs.collection('posts').doc(postID).delete();
    }
    
    getPostsByTags(tags: string[]): Observable<Post[]> {
      return combineLatest([
        this.afs.collection<Post>('posts', ref => 
          ref.where('tags', 'array-contains-any', tags).orderBy('createdAt', 'desc')
        ).valueChanges({ idField: 'postId' }),
        this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
      ]).pipe(
        switchMap(([posts, users]) => {
          const filteredPosts = posts.filter(post => 
            tags.every(tag => post.tags?.includes(tag))
          );
          const postObservables = filteredPosts.map(post => {
            const user = users.find(u => u.userId === post.userId);
            const comments$ = this.getCommentsByPostId(post.postId);
    
            return comments$.pipe(
              map(comments => {
                const commentCount = comments.length;
                return { ...post, user, commentCount };
              })
            );
          });
          return combineLatest(postObservables).pipe(
            defaultIfEmpty([] as Post[]) // Return an empty array if there are no posts available
          );
        })
      );
    }
    saveComment(comment: Comment): Promise<any> {
      const commentCollection = this.afs.collection<Comment>('comments');
      const id = this.afs.createId();
      comment.id = id;
      return commentCollection.doc(id).set(comment);
    }

    getCommentsByPostId(postId: string): Observable<Comment[]> {
      return combineLatest([
        this.afs
          .collection<Comment>('comments', (ref) =>
            ref.where('postId', '==', postId)
          )
          .valueChanges({ idField: 'commentId' }),
        this.afs.collection<User>('users').valueChanges({ idField: 'userId' }),
      ]).pipe(
        map(([comments, users]) => {
          return comments.map((comment) => {
            const user = users.find((u) => u.userId === comment.userId);
            return { ...comment, user };
          });
        })
      );
    }

    deleteComment(commentId: string): Promise<void> {
      return this.afs.collection('comments').doc(commentId).delete();
    }

    editComment(
      commentId: string,
      updatedComment: Partial<Comment>
    ): Promise<void> {
      return this.afs
        .collection('comments')
        .doc(commentId)
        .update(updatedComment);
    }
    toggleLike(postId: string, userId: string): Observable<void> {
      const postRef = this.afs.collection('posts').doc(postId);
      return new Observable<void>((observer) => {
        this.afs.firestore.runTransaction((transaction) => {
          return transaction.get(postRef.ref).then((postDoc) => {
            if (postDoc.exists) {
              const post = postDoc.data() as Post;
              const likes = post.likes || [];
              if (likes.includes(userId)) {
                const index = likes.indexOf(userId);
                likes.splice(index, 1);
              } else {
                likes.push(userId);
              }
              transaction.update(postRef.ref, { likes });
              observer.next();
            } else {
              observer.error('Post not found');
            }
          });
        });
      });
      
    }
    updatePost(postId: string, data: Partial<Post>): Promise<void> {
      return this.afs.collection<Post>('posts').doc(postId).update(data);
    }
    countAllPosts(): Observable<number> {
      return this.afs.collection<Post>('posts').get().pipe(
        map(snapshot => snapshot.size)
      );
    }
    countPostsByDateRange(startDate: Date, endDate: Date): Observable<number> {
      return this.afs.collection<Post>('posts', ref => 
        ref.where('createdAt', '>=', firebase.firestore.Timestamp.fromDate(startDate))
           .where('createdAt', '<=', firebase.firestore.Timestamp.fromDate(endDate))
      ).get().pipe(
        map(snapshot => snapshot.size)
      );
    }
    getPostsByLikedUserId(userId: string): Observable<Post[]> {
      return this.afs.collection<Post>('posts', ref =>
        ref.where('likes', 'array-contains', userId)
      ).valueChanges({ idField: 'postId' }).pipe(
        switchMap(posts => {
          return combineLatest(
            posts.map(post => {
              return this.afs.collection<User>('users').doc(post.userId).valueChanges().pipe(
                map(user => ({ ...post, user }))
              );
            })
          ).pipe(
            defaultIfEmpty([] as Post[]) 
          );
        })
      );
    }
  }
