var React = require('react');

var Settings_bar = React.createClass({
    render:function() {
        return(
            <div className="settings_bar_tag_list">
                <a className="settings_button button_setting" onClick={this.props.settings}>s</a>
            </div>
        )
    }
})

var NewNodeButton = React.createClass({
    getInitialState:function() {
        return ({
            name:'',
            description:''
        })
    },
    handleNameChange:function(event) {
        this.setState({
            name:event.target.value
        })
    },
    handleDescriptionChange:function(event) {
        this.setState({
            description:event.target.value
        })
    },
    render:function() {
        if (this.props.type == 'new-tag') {
            return (
                <form className="newtag"> 
                    <input className="newtag_input w-input" 
                           type="txt" 
                           name="tagName"
                           id="tagName" 
                           placeholder="标签名称" 
                           onChange={this.handleNameChange}
                           />  
                    <input className="newtag_input w-input" 
                           type="txt" 
                           name="description" 
                           id="description" 
                           placeholder="描述"
                           onChange={this.handleDescriptionChange}
                           />  
                    <input className="newtag_button w-button" 
                           type="button" 
                           value="OK" 
                           onClick=
                           {() => {
                                this.props.confirm(this.props.list, 
                                                   this.state.name,
                                                   this.state.description);
                                this.props.cancel();
                           }} 
                           /> 
                    <input className="newtag_button w-button" 
                           type="button" 
                           value="取消" 
                           onClick={this.props.cancel}
                           /> 
                </form>
            );
        } else if (this.props.type == 'new-category') {
            return (
                <form className="newtag"> 
                    <input className="newtag_input w-input"
                           type="txt" 
                           name="categoryName" 
                           id="categoryName" 
                           placeholder="类别名称" 
                           onChange={this.handleNameChange}
                           />  
                    <input className="newtag_button w-button" 
                           type="button" 
                           value="OK" 
                           onClick=
                           {() => {
                               this.props.confirm(this.props.list,
                                                  this.state.name);
                               this.props.cancel();
                           }} 
                           /> 
                    <input className="newtag_button w-button" 
                           type="button" 
                           value="取消" 
                           onClick={this.props.cancel} 
                           /> 
                </form>
        );
        }
    }
})

var Tag = React.createClass({
    insertText: function() {

    },
    render:function() {
        var name        = this.props.name        == undefined ? 'no name'        : this.props.name;
        var description = this.props.description == undefined ? 'no description' : this.props.description;
        return (
            <div className="tag" title={description} onClick={this.props.removeElement}>{name}</div>
        );
    }
})

var Category = React.createClass({
    addNode:function() {

    },
    addCategory:function() {

    },
    insertText:function() {

    },
    render:function() {
        if (this.props.list === undefined) this.list = [];
        else this.list = this.props.list;

        var removeElement=this.props.removeElement;
        var addTag = this.props.addTag;
        var addCategory = this.props.addCategory;
        var addElement = this.props.addElement;
        return (
            <div className="category">
                <div className="category-name">
                    <a className="category-name-content" onClick={this.insertText(this.props.name)}>{this.props.name}</a>
                    <a className="functional_button" onClick={() => this.props.addElement(this.list, 'new-tag')}>+</a>
                    <a className="functional_button" onClick={() => this.props.addElement(this.list, 'new-category')}>C</a>
                </div>
            {this.list.map(function(listValue,index){
                if (listValue.type == 'tag') {
                    return (
                        <Tag name={listValue.name} 
                             key={listValue.id || index}
                             description={listValue.description} 
                             removeElement={() => removeElement(listValue)} />
                    )
                } else if (listValue.type == 'category') {
                    return (
                        <Category name={listValue.name}
                                  key={listValue.id || index}
                                  list={listValue.list}
                                  removeElement={removeElement}
                                  addElement={addElement}
                                  addTag={addTag}
                                  addCategory={addCategory}/>
                    )
                } else if (listValue.type == 'new-tag') {
                    return (
                        <NewNodeButton type='new-tag' 
                                       key={listValue.id || index}
                                       confirm={addTag}
                                       cancel={()=>removeElement(listValue)}
                                       list={this.list}
                                       />
                    )
                } else if (listValue.type == 'new-category') {
                    return (
                        <NewNodeButton type='new-category' 
                                       key={listValue.id || index}
                                       confirm={addCategory}
                                       cancel={()=>removeElement(listValue)}
                                       list={this.list}/>
                    )
                }
            },this)}
            </div>
        );
    }
})

// find a node (category or tag) in the tag list.
function findNode(list, element) {
    if (list) {
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if(list[i] === element) {
                    return [true, list, i];
                } else if (list[i].type == 'category') {
                    [res, __list, index] = findNode(list[i].list, element);
                    if (res) {
                        return [true, __list, index];
                    } 
                }
            }
        }
    }
    return [false, null, null];
}

var TagList = React.createClass({
    getInitialState: function() {
        return {
            taglist:[
                {name:'hahaha', type:'category', list:[{name:'abc', description:'abb',type:'tag'}]}
            ],
            name:'/'
        }
    },
    settings_func:function() {

    },
    removeElement:function(element){
        [res, list, index] = findNode(this.state.taglist, element);
        if (res) {
            list = list.splice(index,1);
            this.updateTaglist();
        }
    },
    addElement:function(list, type) {
        list.push({type:type});
        this.updateTaglist();
    },
    addTag:function(list, name, description) {
        list.push({type:'tag', name:name, description:description});
        this.updateTaglist();
    },
    addCategory:function(list, name) {
        list.push({type:'category', name:name, list:[]});
        this.updateTaglist();
    },
    updateTaglist:function() {
        this.setState({
            taglist:this.state.taglist
        })
    },
    render: function() {
        return (
            <div>
                <Settings_bar settings={this.settings_func} />
                <Category list={this.state.taglist} 
                          removeElement={this.removeElement}
                          addElement={this.addElement}
                          addTag={this.addTag}
                          addCategory={this.addCategory}
                          name={this.state.name}
                          />
                          
            </div>
        );
    }
});

module.exports = TagList;