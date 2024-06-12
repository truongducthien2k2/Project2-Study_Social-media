import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Category, Post } from '../../interface'; 

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afs: AngularFirestore) {}
  addCategory(name: string): Promise<void> {
    const categoryId = this.afs.createId();  
    const category: Category = { id: categoryId, name, postIds: [] };
    const categoryRef = this.afs.collection('categories').doc(categoryId);
    return categoryRef.set(category);
  }
  getCategories(): Observable<Category[]> {
    return this.afs.collection<Category>('categories').valueChanges();
  }
  deleteCategory(categoryId: string): Promise<void> {
    return this.afs.collection('categories').doc(categoryId).delete();
  }

  // Get posts by category ID
  getPostsByCategory(categoryId: string): Observable<Post[]> {
    return this.afs.collection<Category>('categories').doc(categoryId).valueChanges().pipe(
      map(category => category ? category.postIds : []),
      switchMap(postIds => {
        if (postIds.length === 0) {
          return ([]);  // If no postIds, return an empty array
        }
        return forkJoin(postIds.map(postId => this.afs.collection<Post>('posts').doc(postId).valueChanges()));
      }),
      map(posts => posts.filter(post => post !== undefined) as Post[])  // Filter out any undefined posts
    );
  }
}
