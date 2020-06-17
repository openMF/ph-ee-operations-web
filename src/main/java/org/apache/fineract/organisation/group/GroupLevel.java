/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.fineract.organisation.group;

import org.apache.fineract.organisation.parent.AbstractPersistableCustom;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "m_group_level")
public class GroupLevel extends AbstractPersistableCustom<Long> {

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "super_parent", nullable = false)
    private boolean superParent;

    @Column(name = "level_name", nullable = false, length = 100, unique = true)
    private String levelName;

    @Column(name = "recursable", nullable = false)
    private boolean recursable;

    public GroupLevel() {
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public boolean isSuperParent() {
        return superParent;
    }

    public void setSuperParent(boolean superParent) {
        this.superParent = superParent;
    }

    public String getLevelName() {
        return levelName;
    }

    public void setLevelName(String levelName) {
        this.levelName = levelName;
    }

    public boolean isRecursable() {
        return recursable;
    }

    public void setRecursable(boolean recursable) {
        this.recursable = recursable;
    }
}