package io.hexlet.blog.mapper;

import io.hexlet.blog.dto.PostCommentDTO;
import io.hexlet.blog.model.PostComment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        // uses = { JsonNullableMapper.class, ReferenceMapper.class },
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class PostCommentMapper {
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "post.id", target = "postId")
    public abstract PostCommentDTO map(PostComment model);

    @Mapping(source = "authorId", target = "author.id")
    @Mapping(source = "postId", target = "post.id")
    public abstract PostComment map(PostCommentDTO model);
}
