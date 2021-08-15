import React, { useState } from "react";
import firebase from "firebase";
import "./App.css";

const firebaseConfig = {
 
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
//if request.auth != null;の部分をif true;とします

function App() {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleImage = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (image === "") {
      console.log("ファイルが選択されていません");
    }
    // アップロード処理
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    //storage.ref(`/images/${image.name}`)の部分でアップロード先のフォルダ＋ファイル名を指定、
    //その後putメソッドに画像ファイルを渡すことでアップロードできます
    uploadTask.on(
      //.onにはnext, error, completeの3つのコールバックを指定できます。
      firebase.storage.TaskEvent.STATE_CHANGED,
      next,
      error,
      complete
    );
    //nextはアップロードの進行度や状態を取得するための関数
    //errorがエラーが起きたときの処理
    //completeがアップロード成功後の処理です。
  };
  const next = (snapshot) => {
    // 進行中のsnapshotを得る
    // アップロードの進行度を表示
    const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(percent + "% done");
    console.log(snapshot);
  };
  const error = (error) => {
    // エラーハンドリング
    console.log(error);
  };
  const complete = () => {
    // 完了後の処理
    // 画像表示のため、アップロードした画像のURLを取得
    storage
      .ref("images")
      .child(image.name)
      .getDownloadURL()
      .then((fireBaseUrl) => {
        setImageUrl(fireBaseUrl);
      });
  };
  return (
    <div className="App">
      <h1>画像アップロード</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={handleImage} />
        <button>Upload</button>
      </form>
      <img src={imageUrl} alt="uploaded" />
    </div>
  );
}

//handleImageはファイルが選択されたときにその内容を取得します。
//実際のアップロード処理がonSubmitです。
export default App;
