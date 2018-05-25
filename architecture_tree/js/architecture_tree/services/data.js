module.exports = data = function ($http, $q, bus, CONST, filter) {
    'use strict';

    var jsonData;
    var currentFocus;

    /**
     * Get the tree object from json file
     * @returns {Promise}
     */
    var fetchJsonData = function () {
        if (typeof (jsonData) !== 'undefined')
            return $q.when(jsonData);

        return $http.get("serviceNowData.json")
            .then(function (response) {
                setJsonData(response.data.nodes);
                return response.data.nodes;
            });
    };

    var _emitRefresh = function () {
        bus.emit(CONST.EVENTS.DATA_UPDATE, currentFocus);
    };

    /**
     * Get the tree object
     */
    var getJsonData = function () {
        return currentFocus;
    };

    /**
     * Set the tree object
     */
    var setJsonData = function (data) {
        jsonData = _formatData(data);
        setCurrentFocus(jsonData);
        _emitRefresh();
    };

    var setCurrentFocus = function (data) {
        currentFocus = data;
        _emitRefresh();
    };

    var resetFocus = function () {
        currentFocus = jsonData;
        _emitRefresh();
    };

    var getNode = function (key, name, data) {
        data = data || jsonData;
        if (data[key] === name)
            return data;

        if (!data.children)
            return null;

        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNode(key, name, data.children[i]);
            if (matchingNode)
                return matchingNode;
        }
    };

    var getParentNodeByID = function (id, data) {
        data = data || jsonData;
        if (!data.children)
            return null;

        var childrenCount = data.children.length;
        while (childrenCount--) {
            if (data.children[childrenCount].id === id)
                return data;

            var matchingNode = getParentNodeByID(id, data.children[childrenCount]);
            if (matchingNode)
                return matchingNode;
        }
    };

    /**
     * Update a node using another node data
     *
     * @param {Array}  path e.g. ['foo', 'bar', 'baz']
     * @param {Object} updatedNode New node data to use
     * @param {Object} cursor
     */
    var updateNode = function (name, updatedNode) {
        var node = getNode('name', name);
        updateDependencies(node.name, updatedNode.name);
        for (var i in updatedNode) {
            if (updatedNode.hasOwnProperty(i) && i !== 'children' && i !== 'parent' && i !== 'details') {
                node[i] = updatedNode[i];
            }
        }
        _emitRefresh();
    };

    /**
     * Updates a name in the tree dependencies
     * @param {String} name
     * @param {String} newName
     * @param {Object} cursor
     */
    var updateDependencies = function (name, newName, cursor) {
        cursor = cursor || jsonData;

        updateNodeDependency(name, newName, cursor);

        if (typeof(cursor.children) !== 'undefined' && cursor.children.length) {
            cursor.children.forEach(function (child) {
                updateDependencies(name, newName, child);
            });
        }
    };

    /**
     * Function destined to be used in array.map()
     */
    var removeDependencies = function (name) {
        updateDependencies(name);
    };

    function _formatData(data) {

        var addParentId = function (node) {
            if (node.children) {
                node.children.forEach(function (childNode) {
                    childNode.parent = node.id;
                    addParentId(childNode);
                });
            }
        };

        var addAncestors = function (node) {
            if (node.parent && node.parent.id) {
                node.ancestorIdList = (function (node) {
                    var ancestors = [];
                    var parentNode = node.parent;
                    while (parentNode) {
                        if (parentNode.id) {
                            ancestors.push(parentNode.id)
                            parentNode = _getParent(parentNode);
                        } else
                            break;
                    }
                    return ancestors;
                })(node);
            }
            if (node.children)
                node.children.map(addAncestors);
        };

        var _getParent = function (node) {
            if (node.parent)
                return node.parent;

            return false;
        };

        var addDependents = function (node) {
            if (node.dependsOn) {
                node.dependsOn.forEach(function (dependsOn) {
                    var dependency = data.node.get('name', dependsOn, data);
                    if (!dependency) {
                        console.log('Dependency', dependsOn, 'not found for node', node);
                        return;
                    }

                    dependency.dependents = dependency.dependents || []
                    dependency.dependents.push(node.name);
                });
            }
            if (node.children) {
                node.children.map(addDependents);
            }
        };

        var addDetails = function (node) {
            addDetailsForNode(node);
            if (node.children) {
                node.children.map(addDetails);
            }
        };

        /**
         * Add details to a node, including inherited ones (shown between parentheses).
         *
         * Mutates the given node.
         *
         * Example added properties:
         * {
         *   details: {
         *     Dependencies: ["Foo", "Bar (Babar)"],
         *     Dependents: ["Baz", "Buzz"];
         *     Technos: ["Foo", "Bar (Babar)" }
         *     Host: ["OVH", "fo (Foo)"]
         *   }
         * }
         */
        var addDetailsForNode = function (node) {
            node.details = {};
            var dependsOn = getDetailCascade(node, 'dependsOn');
            if (dependsOn.length > 0) {
                node.details.Dependencies = dependsOn.map(getValueAndAncestor);
            }
            if (node.dependents) {
                node.details.Dependents = node.dependents;
            }
            var technos = getDetailCascade(node, 'technos');
            if (technos.length > 0) {
                node.details.Technos = technos.map(getValueAndAncestor);
            }
            if (node.host) {
                node.details.Host = [];
                for (var i in node.host) {
                    node.details.Host.push(i);
                }
            }

            return node;
        };

        var getDetailCascade = function (node, detailName, via) {
            var values = [];
            if (node[detailName]) {
                node[detailName].forEach(function (value) {
                    values.push({value: value, via: via});
                });
            }
            if (node.parent) {
                values = values.concat(getDetailCascade(node.parent, detailName, node.parent.name));
            }
            return values;
        };

        var getValueAndAncestor = function (detail) {
            return detail.via ? detail.value + ' (' + detail.via + ')' : detail.value;
        };

        addParentId(data);
        addDependents(data);
        addDetails(data);
        addAncestors(data);
        return data;
    }

    /**
     * Update or remove one element in a node's dependencies
     *
     * @param {String} name
     * @param {String} newName
     * @param {Object} node
     */
    var updateNodeDependency = function (name, newName, node) {
        if (typeof(node.dependsOn) === 'undefined') {
            return;
        }
        var pos = node.dependsOn.indexOf(name);
        if (pos === -1) return;
        if (newName) {
            // rename dependency
            node.dependsOn[pos] = newName;
        } else {
            // remove dependency
            node.dependsOn.splice(pos, 1);
        }
    };

    /**
     * Adds a child node to the specified node name
     */
    var addNode = function (name, newNode) {
        newNode = newNode || {name: 'New node'};
        var node = getNode('name', name);
        if (!node.children) {
            node.children = [];
        }
        node.children.push(newNode);
        _emitRefresh();
    };

    /**
     * Removes a node in the tree
     */
    var removeNode = function (name) {
        var parentNode = getParentNodeByID(name);
        if (!parentNode) return false;
        for (var i = 0, length = parentNode.children.length; i < length; i++) {
            var child = parentNode.children[i];
            if (child.name === name) {
                // we're in the final Node
                // remove the node (and children) from dependencies
                getBranchNames(child).map(removeDependencies);
                // remove the node
                return parentNode.children.splice(i, 1);
            }
        }
        _emitRefresh();
    };

    /**
     * Move anode under another parent
     */
    var moveNode = function (nodeName, newParentNodeName) {
        var removedNodes = removeNode(nodeName);
        if (!removedNodes || removedNodes.length === 0)
            return false;

        addNode(newParentNodeName, removedNodes[0]);
        _emitRefresh();
    };

    /**
     * Get an array of all the names in the branch
     * Including branch root name, and all descendents names
     */
    var getBranchNames = function (node) {
        var names = [node.name];
        if (node.children) {
            node.children.forEach(function (child) {
                names = names.concat(getBranchNames(child));
            });
        }
        return names;
    };

    return {
        fetchJsonData: fetchJsonData,
        getJsonData: getJsonData,
        setJsonData: setJsonData,
        setCurrentFocus: setCurrentFocus,
        resetFocus: resetFocus,
        node: {
            get: getNode,
            move: moveNode,
            update: updateNode,
            add: addNode,
            remove: removeNode,
        },
        filter: filter
    };
};
