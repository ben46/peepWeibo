var commentModel = module.exports = function weiboUser(screen_name, uid, commentText, created_at){

	this.screen_name = screen_name;
    this.uid = uid;
    this.commentText = commentText;
    this.created_at = created_at;

} 

